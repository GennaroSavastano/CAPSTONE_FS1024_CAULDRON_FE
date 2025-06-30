import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import App from "./App.jsx";
import { Provider } from "react-redux";
import store from "./redux/store/index.js";
import { createRoot } from "react-dom/client";

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <App />
  </Provider>
);
