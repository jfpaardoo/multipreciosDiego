import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Carrito } from "./screens/Carrito";

createRoot(document.getElementById("app") as HTMLElement).render(
  <StrictMode>
    <Carrito />
  </StrictMode>,
);
