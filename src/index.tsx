import React from "react";
import { createRoot } from "react-dom/client";
import "leaflet/dist/leaflet.css";

import App from "./App";

const container = document.getElementById("root");

const root = createRoot(container!);
root.render(
  <React.StrictMode>
    <React.Suspense fallback="loading">
      <App />
    </React.Suspense>
  </React.StrictMode>
);
