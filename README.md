# react-interactive-ascii
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://github.com/sanguine59/react-interactive-ascii/blob/main/LICENSE)[![npm version](https://img.shields.io/npm/v/react-interactive-ascii.svg)](https://www.npmjs.com/package/react-interactive-ascii)

**Your logo. Alive out of ASCII.**

`react-interactive-ascii` is a lightweight React component that turns any image or logo into an interactive ASCII particle canvas — physics, hover repulsion, and click-driven animations included.

---
<img width="960" height="540" alt="Untitleddesign-ezgif com-optimize" src="https://github.com/user-attachments/assets/4930aae7-4ec6-4822-9973-a9808a9e34d0" />

---

## Quick Start

### 1. Install

```bash
npm install react-interactive-ascii
```

Or using your favorite package manager:

```bash
pnpm add react-interactive-ascii
# or yarn add react-interactive-ascii
# or bun add react-interactive-ascii
```

### 2. Drop it into your app

```tsx
import InteractiveAscii from 'react-interactive-ascii';

export default function Hero() {
  return (
    <div style={{ width: '100vw', height: '100vh', background: '#0f0f0f' }}>
      <InteractiveAscii
        src="/brand-logo.svg"
        alt="Brand Logo"
      />
    </div>
  );
}
```

That's it. It samples brightness directly from your image and renders the interactive ASCII canvas on the fly.

---

## How It Works

Every rendered character is an active particle that responds to your pointer and clicks:

- **Hover to repel**: Move the cursor near any character to push it away. Particles smoothly ease back home as you move away.
- **Click to cycle phases**: Every click triggers the next physical state:
  - **`logo`** — The resting, readable formation.
  - **`scattered`** — Particles disperse across space with randomized jitter offsets.
  - **`fallen`** — Gravity pulls particles down with elastic floor bounce.
  - **`returning`** — Characters smoothly spring back to their home coordinates and reset to `logo`.

<details>
<summary>Best image practices for ASCII sampling</summary>

- **High Contrast**: White or bright elements on a dark or transparent background work best.
- **Clean Silhouettes**: Logos, badges, bold typography, and vector graphics translate crisply.
- **Aspect Ratio**: The sampler automatically scales to fit your viewport's character grid.

</details>

---

## Props

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **`src`** | `string` | *required* | Path or URL to the image to sample. |
| **`alt`** | `string` | `""` | Alt text for the underlying fallback image element. |

---

## Contributing

Pull requests are welcome! Check out [CONTRIBUTING.md](https://github.com/sanguine59/react-interactive-ascii/blob/main/CONTRIBUTING.md) for local development setup, commit conventions, and guidelines.

```bash
npm install
npm run build
```

---

## License

[MIT](https://github.com/sanguine59/react-interactive-ascii/blob/main/LICENSE)
