import ReactDOM from 'react-dom';
import { ConfigProvider } from 'antd';
import { BrowserRouter } from 'react-router-dom';
import ptBR from 'antd/lib/locale/pt_BR';

import Schema from 'async-validator';
import App from './App';

import './index.scss';
import { AuthProvider } from './contexts/AuthContext';
import { RequestProvider } from './contexts/RequestContext';
import { WebSocketProvider } from './contexts/WebSocketContext';
import { BrowserPermissionsProvider } from './contexts/BrowserPermissionsContext';

// Disable async-validator pollution warning
Schema.warning = () => undefined;

ReactDOM.render(
  <BrowserRouter>
    <AuthProvider>
      <RequestProvider>
        <WebSocketProvider>
          <BrowserPermissionsProvider>
            <ConfigProvider locale={ptBR}>
              <App />
            </ConfigProvider>
          </BrowserPermissionsProvider>
        </WebSocketProvider>
      </RequestProvider>
    </AuthProvider>
  </BrowserRouter>,
  document.getElementById('root')
);
