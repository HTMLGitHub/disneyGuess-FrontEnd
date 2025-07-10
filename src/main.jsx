import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {BrowserRouter} from 'react-router-dom'
import "./index.css";
import App from "./components/App/App";

console.log("Disney Game Starting ...")

const basename = import.meta.env.DEV ? "/" : "/disneyGuess-FrontEnd";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter basename={basename}>
      <App />
    </BrowserRouter>
  </StrictMode>
);
