import { useEffect, useRef } from 'react';
import "./InteractiveAscii.css"

const CELL_SIZE = 4;
const CELL_GAP = 3;
const CELL_STEP = CELL_SIZE + CELL_GAP;
const ASCII_COLOR = "#dadada"
const ASCII_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
const ASCII_FONT = `${CELL_SIZE + 2}px "Iosevka Web", monospace`;
const BRIGHTNESS_THRESHOLD = 0.5;
const ASCII_MIN_WIDTH = 1000;
const LOGO_COLS = 132;
const HOVER_RADIUS = 10;
const HOVER_PUSH = 7;
const HOVER_EASE = 0.1;
const SCATTER_RANGE = 20;
const SCATTER_EASE = 0.075;
const BOUNCE = 0.25;
const GRAVITY = 0.05;
const RESET_EASE = 0.05;
const STAGGER_FRAMES = 18;

type Phase = "logo" | "scattered" | "fallen" | "returning";

export interface InteractiveAsciiProps {
  src: string;
  alt?: string;
}

interface AsciiCell {
  col: number;
  row: number;
  char: string;
  offsetX: number;
  offsetY: number;
  fallSpeed: number;
  wait: number;
  scatterX: number;
  scatterY: number;
}

interface Cursor {
  col: number;
  row: number;
}

function randomAsciiChar(): string {
  return ASCII_CHARS[Math.floor(Math.random() * ASCII_CHARS.length)];
}

function easeToward(cell: AsciiCell, targetX: number, targetY: number, ease: number): void {
  cell.offsetX += (targetX - cell.offsetX) * ease;
  cell.offsetY += (targetY - cell.offsetY) * ease;
}

function InteractiveAscii({src, alt = ""}: InteractiveAsciiProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const logoRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const logo = logoRef.current;
    if (!canvas || !logo) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const pixelRatio = window.devicePixelRatio || 1;

    let phase: Phase = "logo";
    let gridCols = 0, gridRows = 0;
    let asciiCells: AsciiCell[] = [];
    let frameId = 0;
    const cursor: Cursor = {col: -999, row : -999};

    const buildAsciiFromLogo = (): void => {
      if(window.innerWidth < ASCII_MIN_WIDTH) {
        asciiCells = [];
        return;
      }

      gridCols = Math.floor(window.innerWidth / CELL_STEP);
      gridRows = Math.floor(window.innerHeight / CELL_STEP);
      canvas.width = window.innerWidth * pixelRatio;
      canvas.height = window.innerHeight * pixelRatio;
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

      if (!logo.naturalWidth) return;

      const sampler = document.createElement("canvas");
      sampler.width = gridCols;
      sampler.height = gridRows;
      const samplerContext = sampler.getContext("2d");
      if (!samplerContext) return;

      const logoCols = Math.min(LOGO_COLS, gridCols);
      const logoRows = Math.round(logoCols * logo.naturalHeight / logo.naturalWidth);
      const originCol = Math.floor((gridCols - logoCols) / 2);
      const originRow = Math.floor((gridRows - logoRows) / 2);

      samplerContext.drawImage(logo, originCol, originRow, logoCols, logoRows);

      const { data } = samplerContext.getImageData(0,0,gridCols,gridRows);

      const litCells = new Set<string>();
      for(let row = 0; row < gridRows; row++){
        for(let col = 0; col < gridCols; col++) {
          const pixel = (row * gridCols + col) * 4;
          const alpha = data[pixel + 3] / 255;
          const brightness =
            ((data[pixel] * 0.299 +
              data[pixel + 1] * 0.587 +
              data[pixel + 2] * 0.114) /
            255) *
            alpha;
          if (brightness > BRIGHTNESS_THRESHOLD) {
            litCells.add(`${col},${row}`);
            litCells.add(`${col + 1},${row}`);
          }
        }
      }

      asciiCells = [];
      for (const key of litCells) {
        const [col, row] = key.split(",").map(Number);
        asciiCells.push({
          col,
          row,
          char: randomAsciiChar(),
          offsetX: 0,
          offsetY: 0,
          fallSpeed: 0,
          wait: 0,
          scatterX: (Math.random() - 0.5) * SCATTER_RANGE,
          scatterY: (Math.random() - 0.5) * SCATTER_RANGE,
        });
      }
    };

    const staggerCells = (): void => {
      for(const cell of asciiCells) {
        cell.wait = Math.floor(Math.random() * STAGGER_FRAMES);
      }
    };

    const updateAsciiCells = (): void => {
      let everyoneHome = phase === "returning";

      for (const cell of asciiCells) {
        if (cell.wait > 0) {
          cell.wait--;
          everyoneHome = false;
          continue;
        }

        if(phase === "scattered") {
          easeToward(cell, cell.scatterX, cell.scatterY, SCATTER_EASE);
        } else if (phase === "fallen") {
          const floorOffset = gridRows - 1 - cell.row;
          cell.fallSpeed += GRAVITY;
          cell.offsetY += cell.fallSpeed;

          if (cell.offsetY > floorOffset) {
            cell.offsetY = floorOffset;
            cell.fallSpeed *= -BOUNCE;
          }
        } else if (phase === "returning") {
          easeToward(cell, 0, 0, RESET_EASE);
          if(Math.abs(cell.offsetX) > 0.05 || Math.abs(cell.offsetY) > 0.05) {
            everyoneHome = false;
          }
        } else {
          let targetX = 0;
          let targetY = 0;
          const distX = cell.col - cursor.col;
          const distY = cell.row - cursor.row;
          const distance = Math.sqrt(distX * distX + distY * distY);

          if(distance < HOVER_RADIUS && distance > 0) {
            const push = (1 - distance / HOVER_RADIUS) * HOVER_PUSH;
            targetX = (distX / distance) * push;
            targetY = (distY / distance) * push;
          }
          easeToward(cell, targetX, targetY, HOVER_EASE);
        }
      }

      if (everyoneHome) phase = "logo";
    };

    const drawAscii = (): void => {
      context.clearRect(0,0,window.innerWidth, window.innerHeight);
      context.font = ASCII_FONT;
      context.textBaseline = "top";
      context.textAlign = "center";
      context.fillStyle = ASCII_COLOR;


      for(const {col, row, char, offsetX, offsetY} of asciiCells) {
        const x = (col + offsetX) * CELL_STEP;
        const y = (row + offsetY) * CELL_STEP;
        context.fillText(char, x, y);
      }
    };

    const renderLoop = (): void => {
      if(asciiCells.length > 0) {
        updateAsciiCells();
        drawAscii();
      }
      frameId = requestAnimationFrame(renderLoop)
    };

    const handleMouseMove = (event: MouseEvent): void => {
      cursor.col = event.clientX / CELL_STEP;
      cursor.row = event.clientY / CELL_STEP;
    };

    const handleClick = (): void => {
      if(asciiCells.length === 0) return;

      if(phase === "logo") {
        phase = "scattered";
        staggerCells();
      } else if (phase === "scattered") {
        phase = "fallen";
        for(const cell of asciiCells) cell.fallSpeed = 0;
      } else if (phase === "fallen") {
        phase = "returning";
        staggerCells();
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("click", handleClick);
    window.addEventListener("resize", buildAsciiFromLogo);
    logo.addEventListener("load", buildAsciiFromLogo);
    if(logo.complete) buildAsciiFromLogo();

    let cancelled = false;
    document.fonts.load(ASCII_FONT).then(() => {
      if(!cancelled) buildAsciiFromLogo();
    });

    frameId = requestAnimationFrame(renderLoop);

    return () => {
      cancelled = true;
      cancelAnimationFrame(frameId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("click", handleClick);
      window.removeEventListener("resize", buildAsciiFromLogo);
      logo.removeEventListener("load", buildAsciiFromLogo);
    };
  }, []);

  return (
    <div>
      <canvas ref={canvasRef}></canvas>
      <img ref={logoRef} src={src} alt={alt} crossOrigin='anonymous' />
    </div>
  )
}

export default InteractiveAscii
