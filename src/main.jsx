/* ============================================================
   main.jsx — entry point. Mounts the demonstrator into #root.
   (No StrictMode: the presence state machines use timers and
   IntersectionObservers whose semantics the prototype relied on
   not being double-invoked in development.)
   ============================================================ */
import { createRoot } from "react-dom/client";
import "./styles/tokens.css";
import "./styles/styles.css";
import { App } from "./App.jsx";

createRoot(document.getElementById("root")).render(<App />);
