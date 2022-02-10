import { Button, Steps, Tooltip } from 'antd';
import { Link } from 'react-router-dom';
import { HomeOutlined } from '@ant-design/icons';

import routes from 'src/routes';

import { useState } from 'react';
import { FirstStep } from './FirstStep';
import { SecondStep } from './SecondStep';
import { ThridStep } from './ThridStep';

import styles from './styles.module.scss';

const { Step } = Steps;

export function ForgotPassword(): JSX.Element {
  const [current, setCurrent] = useState<number>(0);
  const [info, setInfo] = useState<ResetPasswordType>({} as ResetPasswordType);

  const steps = [
    {
      title: 'Enviar código',
    },
    {
      title: 'Confirmar código',
    },
    {
      title: 'Resetar a senha',
    },
  ];

  const stepsComponents = [FirstStep, SecondStep, ThridStep];

  const CurrentStep = stepsComponents[current];

  return (
    <main className={styles.container}>
      <div className={styles.steps}>
        <Steps current={current}>
          {steps.map((item) => (
            <Step key={item.title} title={item.title} />
          ))}
        </Steps>
      </div>

      <section className={styles.forgotContainer}>
        <CurrentStep info={info} setInfo={setInfo} setCurrent={setCurrent} />
      </section>

      <div className={styles.bottomButton}>
        <Tooltip title="Voltar para tela de login" placement="left">
          <Link to={routes.LOGIN}>
            <Button
              style={{ minWidth: 50, minHeight: 50 }}
              shape="circle"
              type="primary"
              icon={<HomeOutlined style={{ fontSize: 25 }} />}
            />
          </Link>
        </Tooltip>
      </div>
    </main>
  );
}
