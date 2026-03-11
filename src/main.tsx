import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

// Fix: iOS standalone PWA shows focus but not keyboard.
// The readonly trick forces iOS to re-evaluate first responder.
document.addEventListener("touchend", (e) => {
  const el = e.target;
  if (
    !(el instanceof HTMLInputElement) &&
    !(el instanceof HTMLTextAreaElement)
  )
    return;
  if (el.readOnly) return;

  e.preventDefault();
  el.readOnly = true;

  setTimeout(() => {
    el.readOnly = false;
    el.focus();
    const len = el.value.length;
    el.setSelectionRange(len, len);
  }, 50);
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
