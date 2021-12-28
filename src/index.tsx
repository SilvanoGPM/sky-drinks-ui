import { ConfigProvider } from "antd";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import pt_BR from "antd/lib/locale/pt_BR";

import App from "./App";

import "./index.scss";
import { AuthProvider } from "./contexts/AuthContext";
import { RequestProvider } from "./contexts/RequestContext";
import { WebSocketProvider } from "./contexts/WebSocketContext";

ReactDOM.render(
  <BrowserRouter>
    <AuthProvider>
      <RequestProvider>
        <WebSocketProvider>
          <ConfigProvider locale={pt_BR}>
            <App />
          </ConfigProvider>
        </WebSocketProvider>
      </RequestProvider>
    </AuthProvider>
  </BrowserRouter>,
  document.getElementById("root")
);
