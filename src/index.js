import React from "react";
import APP from "./app";
import { createRoot } from 'react-dom/client';


  createRoot(document.getElementById('root'))
  .render(
  <React.StrictMode>
    <APP />
  </React.StrictMode>);