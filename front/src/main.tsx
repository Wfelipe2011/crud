import React from "react";
import ReactDOM from "react-dom/client";
import { RoutesApp } from "./routes/";
import "./index.css";
import { Toaster } from "react-hot-toast";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Toaster />
    <RoutesApp />
  </React.StrictMode>
);
