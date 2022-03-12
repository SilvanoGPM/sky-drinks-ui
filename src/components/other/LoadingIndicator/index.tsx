import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
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

export function SpinLoadingIndicator(): JSX.Element {
  const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

  return <Spin indicator={antIcon} />;
}
