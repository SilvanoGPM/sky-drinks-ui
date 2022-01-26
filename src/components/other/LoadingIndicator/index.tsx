import { useEffect, useRef } from 'react';
import LoadingBar from 'react-top-loading-bar';
import { useTitle } from 'src/hooks/useTitle';

export function LoadingIndicator(): JSX.Element {
  const ref = useRef<any>(null);
  useTitle('SkyDrinks - Carregando. . .');

  useEffect(() => {
    if (ref.current) {
      ref.current.continuousStart();
    }
  }, [ref]);

  return <LoadingBar ref={ref} height={6} shadow color="#1890ff" />;
}
