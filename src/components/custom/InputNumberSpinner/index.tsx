import { Button, Input } from "antd";
import { useState } from "react";

import styles from "./styles.module.scss";

type InputNumberSpinnerProps = {
  initialValue: number;
  min?: number;
  max?: number;
  incrementChildren?: React.ReactNode;
  decrementChildren?: React.ReactNode;
  beforeDecrement?: (value: number, decrement: () => void) => void;
  beforeIncrement?: (value: number, increment: () => void) => void;
  onDecrement?: (value: number) => void;
  onIncrement?: (value: number) => void;
};

export function InputNumberSpinner({
  initialValue = 0,
  min = 0,
  max = 100,
  decrementChildren = "-",
  incrementChildren = "+",
  beforeDecrement = (_, fn) => fn(),
  beforeIncrement = (_, fn) => fn(),
  onDecrement = () => undefined,
  onIncrement = () => undefined,
}: InputNumberSpinnerProps) {
  const [value, setValue] = useState(initialValue);

  function decrement() {
    beforeDecrement(value, () => {
      const newValue = Math.max(value - 1, min);
      setValue(newValue);
      onDecrement(newValue);
    });
  }

  function increment() {
    beforeIncrement(value, () => {
      const newValue = Math.min(value + 1, max);
      setValue(newValue);
      onIncrement(newValue);
    });
  }

  return (
    <div className={styles.container}>
      <Button onClick={decrement}>{decrementChildren}</Button>
      <Input value={value} className={styles.input} />
      <Button onClick={increment}>{incrementChildren}</Button>
    </div>
  );
}
