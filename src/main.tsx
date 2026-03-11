import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

// Fix: iOS standalone PWA doesn't show keyboard on input tap
const isStandalone =
  (navigator as any).standalone ||
  window.matchMedia("(display-mode: standalone)").matches;

if (isStandalone) {
  document.addEventListener("touchend", (e) => {
    const el = e.target as HTMLElement;
    if (el.matches("input, textarea, select")) {
      e.preventDefault();
      el.focus();
    }
  });
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
