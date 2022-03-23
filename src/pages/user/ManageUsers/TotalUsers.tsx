import { Card, Col, Row, Statistic, Tooltip } from 'antd';
import { LockOutlined, UnlockOutlined, UserOutlined } from '@ant-design/icons';
import { useQuery } from 'react-query';

import endpoints from 'src/api/api';
import { handleError } from 'src/utils/handleError';
import { SpinLoadingIndicator } from 'src/components/other/LoadingIndicator';

import styles from './styles.module.scss';

export function TotalUsers(): JSX.Element {
  const { isLoading, isError, error, data } = useQuery(
    'totalUsers',
    endpoints.countTotalUsers
  );

  if (isError) {
    handleError({
      error,
      fallback: 'Não foi possível carregar o total de usuários',
    });

    return <></>;
  }

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <SpinLoadingIndicator />
      </div>
    );
  }

  return (
    <Row gutter={[8, 8]}>
      <Col sm={24}>
        <Tooltip title="Total de usuários registrados" placement="bottom">
          <Card>
            <Statistic
              title="Total"
              prefix={<UserOutlined />}
              value={data?.total}
            />
          </Card>
        </Tooltip>
      </Col>
      <Col xs={24} sm={12}>
        <Tooltip title="Usuários não bloqueados" placement="bottom">
          <Card>
            <Statistic
              title="Não bloqueados"
              value={data?.unlocked}
              valueStyle={{ color: '#2ecc71' }}
              prefix={<UnlockOutlined />}
            />
          </Card>
        </Tooltip>
      </Col>
      <Col xs={24} sm={12}>
        <Tooltip title="Usuários bloqueados" placement="bottom">
          <Card>
            <Statistic
              title="Bloqueados"
              value={data?.locked}
              valueStyle={{ color: '#e74c3c' }}
              prefix={<LockOutlined />}
            />
          </Card>
        </Tooltip>
      </Col>
    </Row>
  );
}
