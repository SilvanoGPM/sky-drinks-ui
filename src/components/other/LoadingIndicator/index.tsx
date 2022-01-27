import { useEffect, useRef } from 'react';
import LoadingBar from 'react-top-loading-bar';

export function LoadingIndicator(): JSX.Element {
  const ref = useRef<any>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.continuousStart();
    }
  }, [ref]);

  return <LoadingBar ref={ref} height={6} shadow color="#1890ff" />;
}
