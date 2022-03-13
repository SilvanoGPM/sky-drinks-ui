import React, { useContext } from 'react';
import { StompSessionProvider } from 'react-stomp-hooks';
import { StompSessionProviderProps } from 'react-stomp-hooks/dist/interfaces/StompSessionProviderProps';

import { AppRoutes } from './routes';
import { AuthContext } from './contexts/AuthContext';
import { baseURL } from './api/api';
import { NotificateRequestUpdates } from './components/other/NotificateRequestUpdates';

const SOCKET_URL = `${baseURL}/sky-drinks`;

function App(): JSX.Element {
  const { authenticated, token } = useContext(AuthContext);

  const Wrapper = authenticated ? StompSessionProvider : React.Fragment;

  const options = {
    ...(authenticated
      ? {
          connectHeaders: { Authorization: token },
          url: SOCKET_URL,
        }
      : {}),
  } as StompSessionProviderProps;

  return (
    <Wrapper {...options}>
      {authenticated && <NotificateRequestUpdates />}

      <AppRoutes />
    </Wrapper>
  );
}

export default App;
