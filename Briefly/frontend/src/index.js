import React from "react";
import ReactDOM from "react-dom";
import { Provider as ReduxProvider } from "react-redux";
import App from "./components/App";
import configureStore from "./redux/store";

const initialState = {};

const store = configureStore(initialState);
const rootElement = document.getElementById("app");

ReactDOM.render(
  <React.StrictMode>
    <ReduxProvider store={store}>
      <App />
    </ReduxProvider>
  </React.StrictMode>,
  rootElement
);
