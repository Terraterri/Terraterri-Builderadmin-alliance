import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import store from "./store/Store";
import { Provider } from 'react-redux';
// const currentPath = document.location.pathname
// console.log(currentPath);

ReactDOM.createRoot(document.getElementById("root")).render(
  // <BrowserRouter>
  <BrowserRouter>
    <Provider store={store}>
    <App />
    </Provider>
  </BrowserRouter>
);