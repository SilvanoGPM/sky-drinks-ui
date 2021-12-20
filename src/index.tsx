import { ConfigProvider } from "antd";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import pt_BR from "antd/lib/locale/pt_BR";

import App from "./App";

import "./index.scss";

ReactDOM.render(
  <BrowserRouter>
    <ConfigProvider locale={pt_BR}>
      <App />
    </ConfigProvider>
  </BrowserRouter>,
  document.getElementById("root")
);
