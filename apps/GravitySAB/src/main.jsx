import { render } from "preact";
import * as preactCompat from "preact/compat";
console.log("[SAB] main.jsx: preact imported");

import { App } from "./App";
console.log("[SAB] main.jsx: App imported");

import { useComponentData } from "@gravity-platform/gravity-client";
console.log("[SAB] main.jsx: gravity-client imported");

import "./index.css";

// Expose Preact as React for dynamic component loading
// This allows dynamically loaded components to use React hooks
window.React = preactCompat;
window.ReactDOM = { render };
console.log("[SAB] main.jsx: window.React set");

// Expose component data store globally for dynamic components
window.__gravityComponentData = useComponentData;

console.log("[SAB] main.jsx: about to render");
try {
  render(<App />, document.getElementById("app"));
  console.log("[SAB] main.jsx: render() completed");
} catch (e) {
  console.error("[SAB] main.jsx: render() FAILED", e);
}
