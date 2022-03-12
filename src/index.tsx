import ReactDOM from 'react-dom';
import { ConfigProvider } from 'antd';
import { BrowserRouter } from 'react-router-dom';
import ptBR from 'antd/lib/locale/pt_BR';
import Schema from 'async-validator';
import { QueryClient, QueryClientProvider } from 'react-query';

import App from './App';

import { AuthProvider } from './contexts/AuthContext';
import { RequestProvider } from './contexts/RequestContext';
import { WebSocketProvider } from './contexts/WebSocketContext';
import { BrowserPermissionsProvider } from './contexts/BrowserPermissionsContext';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

import './index.scss';

const queryClient = new QueryClient();

// Disable async-validator pollution warning
Schema.warning = () => undefined;

ReactDOM.render(
  <QueryClientProvider client={queryClient}>
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
    </BrowserRouter>
  </QueryClientProvider>,
  document.getElementById('root')
);

serviceWorkerRegistration.register();
