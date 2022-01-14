import { useEffect, useState } from "react";
import endpoints from "src/api/api";
import { handleError } from "src/utils/handleError";
import styles from "./styles.module.scss";
import { Bar, Doughnut, Line } from "react-chartjs-2";

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
} from "chart.js";
import {
  Card,
  Col,
  Divider,
  Empty,
  Row,
  Select,
  Statistic,
  Tooltip,
} from "antd";
import moment from "moment";
import { useTitle } from "src/hooks/useTitle";
import { formatDisplayPrice } from "src/utils/formatDisplayPrice";
import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  CheckOutlined,
  CloseOutlined,
  DollarOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { sum } from "src/utils/sum";
import { randomHotRGBColor, randomRGB } from "src/utils/randomRGB";
import { Loading } from "src/components/layout/Loading";

type RequestLengthAndPrice = {
  price: number;
  length: number;
};

type RequestData = {
  [key: string]: RequestLengthAndPrice;
};

type RequestsData = {
  requestsDelivered: RequestData;
  requestsCanceled: RequestData;
  requestsProcessing: RequestData;
};

type TopDrinkType = {
  drinkUUID: string;
  name: string;
  total: number;
};

type DataOfDrinksType = {
  topDrinks: TopDrinkType[];
  mostCanceled: TopDrinkType[];
};

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

const ALL_TIME = "0";

export function Dashboard() {
  useTitle("SkyDrinks - Dashboard");

  const [requestsData, setRequestsData] = useState<RequestsData>(
    {} as RequestsData
  );

  const [dataOfDrinks, setDataOfDrinks] = useState<DataOfDrinksType>(
    {} as DataOfDrinksType
  );

  const [months, setMonths] = useState<string[]>([]);
  const [selectedMonth, setSelectedMonth] = useState(ALL_TIME);

  const [requestsDataLoading, setRequestsDataLoading] = useState(true);
  const [topDrinksLoading, setDataOfDrinksLoading] = useState(true);
  const [monthsLoading, setMonthsLoading] = useState(true);

  useEffect(() => {
    async function loadMonths() {
      try {
        const months = await endpoints.getAllMonths();
        setMonths(months);
      } catch (error) {
        handleError({
          error,
          fallback: "Não foi possível carregar os meses",
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
    async function loadRequestsDelivered() {
      try {
        const allTime = selectedMonth === ALL_TIME;

        const startMonth = allTime ? months[months.length - 1] : undefined;
        const endMonth = allTime ? months[0] : undefined;

        const requestsData = await endpoints.getRequestsData(
          selectedMonth,
          startMonth,
          endMonth
        );
        setRequestsData(requestsData);
      } catch (error) {
        handleError({
          error,
          fallback: "Não foi possível carregar os dados dos pedidos",
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
    async function loadTopDrinks() {
      try {
        const dataOfDrinks = await endpoints.getDataOfDrinksInRequests(10);
        setDataOfDrinks(dataOfDrinks);
      } catch (error) {
        handleError({
          error,
          fallback: "Não foi possível carregar os dados das bebidas",
        });
      } finally {
        setDataOfDrinksLoading(false);
      }
    }

    if (topDrinksLoading) {
      loadTopDrinks();
    }
  }, [topDrinksLoading]);

  useEffect(() => {
    return () => {
      setRequestsDataLoading(false);
      setDataOfDrinksLoading(false);
      setMonthsLoading(false);
    };
  }, []);

  function getMonthsInRequestsData() {
    return Object.values(requestsData)
      .map(Object.keys)
      .flat()
      .sort((a, b) => moment(a).diff(b));
  }

  function mapRequestData(
    requestData: RequestData,
    attr: keyof RequestLengthAndPrice
  ) {
    if (!requestData) return [];

    return getMonthsInRequestsData().map((month) => {
      const x = requestData[month]?.[attr];
      return x ? x : 0;
    });
  }

  function sumRequestData(requestData: RequestData) {
    return sum(Object.values(requestData), (n) => n.price);
  }

  function getRevenues() {
    const { requestsDelivered, requestsCanceled } = requestsData;

    const totalDelivered = sumRequestData(requestsDelivered);
    const totalCanceled = sumRequestData(requestsCanceled);

    return [totalDelivered, totalCanceled];
  }

  function handleSelectedMonth(month: string) {
    setSelectedMonth(month);
    setRequestsDataLoading(true);
  }

  const hasRequests =
    Boolean(getMonthsInRequestsData().length) && !requestsDataLoading;

  const revenues = hasRequests ? getRevenues() : [];

  const requestsDelivered = mapRequestData(
    requestsData.requestsDelivered,
    "length"
  );

  const requestsCanceled = mapRequestData(
    requestsData.requestsCanceled,
    "length"
  );

  const requestsProcessing = mapRequestData(
    requestsData.requestsProcessing,
    "length"
  );

  let delayed = false;

  const hasDataOfDrinks = Boolean(Object.values(dataOfDrinks).flat().length);

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Dashboard</h2>

      {requestsDataLoading ? (
        <Loading />
      ) : (
        <>
          <>
            <div>
              <Divider orientation="left" style={{ fontSize: "1.6rem" }}>
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
                      {moment(month).format("MMMM [de] YYYY")}
                    </Option>
                  ))}
                  <Option value={ALL_TIME}>Todos os meses</Option>
                </Select>
              </div>

              {hasRequests ? (
                <>
                  <div className={styles.revenues}>
                    <Doughnut
                      options={{
                        responsive: true,
                        rotation: 180,
                        plugins: {
                          title: {
                            display: true,
                            text: "Receita/Perda do mês",
                            font: {
                              size: 20,
                            },
                          },
                          legend: { display: false },
                          tooltip: {
                            callbacks: {
                              label({ label, formattedValue }) {
                                return `${label} de ${formatDisplayPrice(
                                  Number(formattedValue)
                                )}`;
                              },
                            },
                          },
                        },
                      }}
                      data={{
                        labels: ["Receita", "Perda"],
                        datasets: [
                          {
                            backgroundColor: [
                              "rgba(46, 204, 113, 0.3)",
                              "rgba(231, 76, 60, 0.3)",
                            ],
                            borderColor: [
                              "rgb(46, 204, 113)",
                              "rgb(231, 76, 60)",
                            ],
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
                            valueStyle={{ color: "#2ecc71" }}
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
                            valueStyle={{ color: "#e74c3c" }}
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
                              context.type === "data" &&
                              context.mode === "default" &&
                              !delayed
                            ) {
                              delay =
                                context.dataIndex * 50 +
                                context.datasetIndex * 100;
                            }
                            return delay;
                          },
                        },
                        scales: {
                          y: {
                            title: {
                              display: true,
                              text: "Quantidade de pedidos",
                            },
                          },
                          x: {
                            title: {
                              display: true,
                              text: "Datas",
                            },
                          },
                        },
                        plugins: {
                          title: {
                            display: true,
                            text: "Pedidos realizados no mês",
                            font: {
                              size: 20,
                            },
                          },
                        },
                      }}
                      data={{
                        labels: getMonthsInRequestsData(),
                        datasets: [
                          {
                            label: "Pedidos entregues",
                            backgroundColor: "#2ecc71",
                            borderColor: "#2ecc71",
                            data: requestsDelivered,
                          },
                          {
                            label: "Pedidos cancelados",
                            backgroundColor: "#e74c3c",
                            borderColor: "#e74c3c",
                            data: requestsCanceled,
                          },
                          {
                            label: "Pedidos sendo processados",
                            backgroundColor: "#1890ff",
                            borderColor: "#1890ff",
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
                              valueStyle={{ color: "#2ecc71" }}
                              prefix={<CheckOutlined />}
                            />
                          </Card>
                        </Col>
                        <Col span={12}>
                          <Card>
                            <Statistic
                              title="Cancelados"
                              value={sum(requestsCanceled)}
                              valueStyle={{ color: "#e74c3c" }}
                              prefix={<CloseOutlined />}
                            />
                          </Card>
                        </Col>
                        <Col span={12}>
                          <Card>
                            <Statistic
                              title="Processando"
                              value={sum(requestsProcessing)}
                              valueStyle={{ color: "#1890ff" }}
                              prefix={<LoadingOutlined />}
                            />
                          </Card>
                        </Col>
                      </Row>
                    </div>
                  </div>
                </>
              ) : (
                <Empty description="Não há pedidos" />
              )}
            </div>
          </>
        </>
      )}

      {topDrinksLoading ? (
        <Loading />
      ) : hasDataOfDrinks ? (
        <div className={styles.dataOfDrinksContainer}>
          <Divider orientation="left" style={{ fontSize: "1.6rem" }}>
            Bebidas
          </Divider>

          <div className={styles.dataOfDrinks}>
            <Bar
              options={{
                scales: {
                  y: {
                    title: {
                      display: true,
                      text: "Vezes pedida",
                    },
                  },
                  x: {
                    title: {
                      display: true,
                      text: "Nome da bebida",
                    },
                  },
                },
                plugins: {
                  title: {
                    display: true,
                    text: "Bebidas mais pedidas",
                    font: { size: 20 },
                  },
                  legend: {
                    display: false,
                  },
                },
                responsive: true,
              }}
              data={{
                labels: dataOfDrinks.topDrinks.map(({ name }) => name),
                datasets: [
                  {
                    data: dataOfDrinks.topDrinks.map(({ total }) => total),
                    backgroundColor: dataOfDrinks.topDrinks.map(randomRGB),
                  },
                ],
              }}
            />
          </div>

          <div className={styles.dataOfDrinks}>
            <Bar
              options={{
                scales: {
                  y: {
                    title: {
                      display: true,
                      text: "Vezes cancelada",
                    },
                  },
                  x: {
                    title: {
                      display: true,
                      text: "Nome da bebida",
                    },
                  },
                },
                plugins: {
                  title: {
                    display: true,
                    text: "Bebidas mais canceladas",
                    font: { size: 20 },
                  },
                  legend: {
                    display: false,
                  },
                },
                responsive: true,
              }}
              data={{
                labels: dataOfDrinks.mostCanceled.map(({ name }) => name),
                datasets: [
                  {
                    data: dataOfDrinks.mostCanceled.map(({ total }) => total),
                    backgroundColor:
                      dataOfDrinks.topDrinks.map(randomHotRGBColor),
                  },
                ],
              }}
            />
          </div>
        </div>
      ) : (
        <Empty description="Nenhuma pedido encontrado" />
      )}
    </div>
  );
}
