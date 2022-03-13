import { useEffect, useState } from 'react';
import { Doughnut, Line } from 'react-chartjs-2';
import moment from 'moment';

import {
  Card,
  Col,
  Divider,
  Empty,
  Row,
  Select,
  Statistic,
  Tooltip,
} from 'antd';

import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  CheckOutlined,
  CloseOutlined,
  DollarOutlined,
  LoadingOutlined,
} from '@ant-design/icons';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip as TooltipChartJS,
  Legend,
  ArcElement,
} from 'chart.js';

import endpoints from 'src/api/api';
import { handleError } from 'src/utils/handleError';
import { LoadingIndicator } from 'src/components/other/LoadingIndicator';
import { formatDisplayPrice } from 'src/utils/formatDisplayPrice';
import { sum } from 'src/utils/sum';
import { formatDatabaseDate } from 'src/utils/formatDatabaseDate';

import styles from './styles.module.scss';

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  TooltipChartJS,
  Legend
);

const { Option } = Select;

const ALL_TIME = '0';

export function DataOfRequests(): JSX.Element {
  const [requestsData, setRequestsData] = useState<RequestsData>(
    {} as RequestsData
  );

  const [months, setMonths] = useState<string[]>([]);
  const [selectedMonth, setSelectedMonth] = useState(ALL_TIME);

  const [requestsDataLoading, setRequestsDataLoading] = useState(true);
  const [monthsLoading, setMonthsLoading] = useState(true);

  useEffect(() => {
    async function loadMonths(): Promise<void> {
      try {
        const monthsFound = await endpoints.getAllMonths();
        setMonths(monthsFound);
      } catch (error) {
        handleError({
          error,
          fallback: 'Não foi possível carregar os meses',
        });
      } finally {
        setMonthsLoading(false);
      }
    }

    if (monthsLoading) {
      loadMonths();
    }
  }, [monthsLoading]);

  useEffect(() => {
    async function loadRequestsDelivered(): Promise<void> {
      try {
        if (!months.length) {
          return;
        }

        const allTime = selectedMonth === ALL_TIME;

        const startMonth =
          allTime && months.length ? months[months.length - 1] : undefined;

        const endMonth = allTime && months.length ? months[0] : undefined;

        const requestsDataFound = await endpoints.getRequestsData(
          selectedMonth,
          startMonth,
          endMonth
        );

        setRequestsData(requestsDataFound);
      } catch (error) {
        handleError({
          error,
          fallback: 'Não foi possível carregar os dados dos pedidos',
        });
      } finally {
        setRequestsDataLoading(false);
      }
    }

    if (requestsDataLoading && !monthsLoading) {
      loadRequestsDelivered();
    }
  }, [requestsDataLoading, selectedMonth, monthsLoading, months]);

  useEffect(() => {
    return () => {
      setRequestsDataLoading(false);
      setMonthsLoading(false);
    };
  }, []);

  function getMonthsInRequestsData(): string[] {
    return Object.values(requestsData)
      .map(Object.keys)
      .flat()
      .filter((month, index, arr) => arr.indexOf(month) === index)
      .sort((a, b) => moment(a).diff(b));
  }

  function mapRequestData(
    requestData: RequestData,
    attr: keyof RequestLengthAndPrice
  ): number[] {
    if (!requestData) return [];

    return getMonthsInRequestsData().map((month) => {
      const value = requestData[month]?.[attr];
      return value || 0;
    });
  }

  function sumRequestData(requestData: RequestData): number {
    return sum(Object.values(requestData), (n) => n.price);
  }

  function getRevenues(): number[] {
    const { requestsDelivered, requestsCanceled } = requestsData;

    const totalDelivered = sumRequestData(requestsDelivered);
    const totalCanceled = sumRequestData(requestsCanceled);

    return [totalDelivered, totalCanceled];
  }

  function handleSelectedMonth(month: string): void {
    setSelectedMonth(month);
    setRequestsDataLoading(true);
  }

  const hasRequests =
    Boolean(getMonthsInRequestsData().length) && !requestsDataLoading;

  const revenues = hasRequests ? getRevenues() : [];

  const requestsDelivered = mapRequestData(
    requestsData.requestsDelivered,
    'length'
  );

  const requestsCanceled = mapRequestData(
    requestsData.requestsCanceled,
    'length'
  );

  const requestsProcessing = mapRequestData(
    requestsData.requestsProcessing,
    'length'
  );

  let delayed = false;

  if (requestsDataLoading) {
    return <LoadingIndicator />;
  }

  return (
    <div>
      {hasRequests ? (
        <>
          <Divider orientation="left" style={{ fontSize: '1.6rem' }}>
            Pedidos
          </Divider>

          <div className={styles.selectMonth}>
            <p>Mês:</p>
            <Select
              className={styles.select}
              loading={monthsLoading}
              disabled={monthsLoading}
              defaultValue={ALL_TIME}
              value={selectedMonth}
              onChange={handleSelectedMonth}
            >
              {months.map((month) => (
                <Option key={month} value={month}>
                  {moment(month).format('MMMM [de] YYYY')}
                </Option>
              ))}
              <Option value={ALL_TIME}>Todos os meses</Option>
            </Select>
          </div>

          <div className={styles.revenues}>
            <Doughnut
              options={{
                responsive: true,
                rotation: 180,
                plugins: {
                  title: {
                    display: true,
                    text: 'Receita/Perda do mês',
                    font: {
                      size: 20,
                    },
                  },
                  legend: { display: false },
                  tooltip: {
                    callbacks: {
                      label({ label, formattedValue }) {
                        return `${label} de R$ ${formattedValue}`;
                      },
                    },
                  },
                },
              }}
              data={{
                labels: ['Receita', 'Perda'],
                datasets: [
                  {
                    backgroundColor: [
                      'rgba(46, 204, 113, 0.3)',
                      'rgba(231, 76, 60, 0.3)',
                    ],
                    borderColor: ['rgb(46, 204, 113)', 'rgb(231, 76, 60)'],
                    data: revenues,
                  },
                ],
              }}
            />
          </div>

          <Row gutter={[8, 8]}>
            <Col xs={24} sm={12}>
              <Tooltip
                title="Receita dos pedidos já entregues"
                placement="bottom"
              >
                <Card>
                  <Statistic
                    title="Receita"
                    value={formatDisplayPrice(revenues[0])}
                    precision={2}
                    valueStyle={{ color: '#2ecc71' }}
                    prefix={<ArrowUpOutlined />}
                  />
                </Card>
              </Tooltip>
            </Col>
            <Col xs={24} sm={12}>
              <Tooltip
                title="Pedidos cancelados geram perda de receita"
                placement="bottom"
              >
                <Card>
                  <Statistic
                    title="Perda"
                    value={formatDisplayPrice(revenues[1])}
                    precision={2}
                    valueStyle={{ color: '#e74c3c' }}
                    prefix={<ArrowDownOutlined />}
                  />
                </Card>
              </Tooltip>
            </Col>
          </Row>

          <div className={styles.requestDataChart}>
            <Line
              options={{
                animation: {
                  onComplete: () => {
                    delayed = true;
                  },
                  delay: (context: any) => {
                    let delay = 0;
                    if (
                      context.type === 'data' &&
                      context.mode === 'default' &&
                      !delayed
                    ) {
                      delay =
                        context.dataIndex * 50 + context.datasetIndex * 100;
                    }
                    return delay;
                  },
                },
                scales: {
                  y: {
                    title: {
                      display: true,
                      text: 'Quantidade de pedidos',
                    },
                  },
                  x: {
                    title: {
                      display: true,
                      text: 'Datas',
                    },
                    ticks: {
                      maxRotation: 90,
                      minRotation: 30,
                    },
                  },
                },
                plugins: {
                  title: {
                    display: true,
                    text: 'Pedidos realizados no mês',
                    font: {
                      size: 20,
                    },
                  },
                },
              }}
              data={{
                labels: getMonthsInRequestsData().map(formatDatabaseDate),
                datasets: [
                  {
                    label: 'Pedidos entregues',
                    backgroundColor: '#2ecc71',
                    borderColor: '#2ecc71',
                    data: requestsDelivered,
                  },
                  {
                    label: 'Pedidos cancelados',
                    backgroundColor: '#e74c3c',
                    borderColor: '#e74c3c',
                    data: requestsCanceled,
                  },
                  {
                    label: 'Pedidos sendo processados',
                    backgroundColor: '#1890ff',
                    borderColor: '#1890ff',
                    data: requestsProcessing,
                  },
                ],
              }}
            />

            <div className={styles.requestDataInfo}>
              <Row gutter={[8, 8]}>
                <Col span={12}>
                  <Card>
                    <Statistic
                      title="Total"
                      value={sum([
                        ...requestsDelivered,
                        ...requestsCanceled,
                        ...requestsProcessing,
                      ])}
                      prefix={<DollarOutlined />}
                    />
                  </Card>
                </Col>
                <Col span={12}>
                  <Card>
                    <Statistic
                      title="Entregados"
                      value={sum(requestsDelivered)}
                      valueStyle={{ color: '#2ecc71' }}
                      prefix={<CheckOutlined />}
                    />
                  </Card>
                </Col>
                <Col span={12}>
                  <Card>
                    <Statistic
                      title="Cancelados"
                      value={sum(requestsCanceled)}
                      valueStyle={{ color: '#e74c3c' }}
                      prefix={<CloseOutlined />}
                    />
                  </Card>
                </Col>
                <Col span={12}>
                  <Card>
                    <Statistic
                      title="Processando"
                      value={sum(requestsProcessing)}
                      valueStyle={{ color: '#1890ff' }}
                      prefix={<LoadingOutlined />}
                    />
                  </Card>
                </Col>
              </Row>
            </div>
          </div>
        </>
      ) : (
        <Empty style={{ marginTop: '2rem' }} description="Não há pedidos" />
      )}
    </div>
  );
}
