import React from "react";
import ReactDOM from "react-dom";

import App from "./components/App";

const rootElement = document.getElementById("app");
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  rootElement
);