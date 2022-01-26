import { Spin } from 'antd';

export function Loading(): JSX.Element {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '1.5rem',
      }}
    >
      <Spin />
    </div>
  );
}
