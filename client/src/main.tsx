import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

const rootElement = document.getElementById("root");

if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );

  // Instantly remove #kx-boot overlay
  const boot = document.getElementById("kx-boot");
  if (boot) {
    boot.classList.add("kx-boot-hidden");
    setTimeout(() => {
      try {
        boot.remove();
      } catch (e) {}
    }, 250);
  }
}
