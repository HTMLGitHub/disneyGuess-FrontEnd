import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {BrowserRouter} from 'react-router-dom'
import "./index.css";
import App from "./components/App/App";

console.log("Disney Game Starting ...")

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter basename="/disneyGuess-FrontEnd">
      <App />
    </BrowserRouter>
  </StrictMode>
);
