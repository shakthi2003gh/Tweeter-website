import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import Router from "./router";
import { ToastContainer } from "react-toastify";
import "./styles/index.scss";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Router />
      <ToastContainer className="p-2" />
    </BrowserRouter>
  </React.StrictMode>
);
