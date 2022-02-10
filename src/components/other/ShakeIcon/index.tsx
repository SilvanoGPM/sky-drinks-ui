import { useState } from 'react';
import { useSpring, animated } from 'react-spring';

import styles from './styles.module.scss';

const defaultConfig = { x: 0, rotate: 0, scale: 0 };

interface ShakeIconProps {
  children: JSX.Element;
}

export function ShakeIcon({ children }: ShakeIconProps): JSX.Element {
  const [shaking, setShaking] = useState<boolean>(false);

  const { x, rotate, scale } = useSpring({
    from: defaultConfig,
    to: shaking ? { x: 1, rotate: 1, scale: 1 } : defaultConfig,
    onRest: () => {
      if (shaking) {
        setShaking(false);
      }
    },
    config: {
      tension: 210,
      friction: 30,
    },
  });

  const xInterpolate = x.to([0, 0.5, 1], [0, -30, 30]);

  const rotateInterpolate = rotate.to([0, 0.5, 1], [0, -30, 30]);
  const scaleInterpolate = scale.to([0, 0.5, 1], [1, 0.6, 1]);

  function enableShaking(): void {
    if (!shaking) {
      setShaking(true);
    }
  }

  return (
    <animated.div
      onClick={enableShaking}
      className={styles.icon}
      style={{
        x: xInterpolate,
        rotate: rotateInterpolate,
        scale: scaleInterpolate,
      }}
    >
      {children}
    </animated.div>
  );
}
