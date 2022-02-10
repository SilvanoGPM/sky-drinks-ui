import { Steps } from 'antd';
import { useState } from 'react';
import { FirstStep } from './FirstStep';
import { SecondStep } from './SecondStep';

import styles from './styles.module.scss';
import { ThridStep } from './ThridStep';

const { Step } = Steps;

export function ForgotPassword(): JSX.Element {
  const [current, setCurrent] = useState<number>(0);
  const [email, setEmail] = useState<string>('');

  function goToStep(newCurrent: number) {
    return () => {
      setCurrent(newCurrent);
    };
  }

  const steps = [
    {
      title: 'Enviar código',
      onClick: goToStep(0),
    },
    {
      title: 'Confirmar código',
    },
    {
      title: 'Resetar a senha',
    },
  ];

  function handleFinish(values: { email: string }): void {
    setEmail(values.email);
  }

  const stepsComponents = [FirstStep, SecondStep, ThridStep];

  const CurrentStep = stepsComponents[current];

  return (
    <main className={styles.container}>
      <div className={styles.steps}>
        <Steps current={current}>
          {steps.map((item) => (
            <Step onClick={item?.onClick} key={item.title} title={item.title} />
          ))}
        </Steps>
      </div>

      <section className={styles.forgotContainer}>
        <CurrentStep
          email={email}
          setCurrent={setCurrent}
          handleFinish={handleFinish}
        />
      </section>
    </main>
  );
}
