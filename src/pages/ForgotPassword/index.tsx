import { Steps } from 'antd';
import { useState } from 'react';
import { FirstStep } from './FirstStep';
import { SecondStep } from './SecondStep';

import styles from './styles.module.scss';

const { Step } = Steps;

export function ForgotPassword(): JSX.Element {
  const [current, setCurrent] = useState<number>(0);

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

  const stepsComponents = [
    <FirstStep setCurrent={setCurrent} />,
    <SecondStep />,
  ];

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
        {stepsComponents[current]}
      </section>
    </main>
  );
}
