import { createRoot } from "react-dom/client";
import InteractiveAscii from "../src";

createRoot(document.getElementById("root")!).render(
    <InteractiveAscii src="/logo.jpg" alt="" resolution={{ width: 1920, height: 1080 }} />
);
