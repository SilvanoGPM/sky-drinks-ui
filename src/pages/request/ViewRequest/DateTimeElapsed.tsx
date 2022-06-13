import { useEffect, useRef, useState } from 'react';
import moment from 'moment';

import styles from './styles.module.scss';

type DateTimeElapsedProps = {
  start: Date;
  initalTimeText: string;
  prefix: string;
};

const ONE_MINUTE = 1000 * 60;

export function DateTimeElapsed({
  start,
  initalTimeText,
  prefix,
}: DateTimeElapsedProps): JSX.Element {
  const intervalId = useRef<NodeJS.Timeout>();
  const [time, setTime] = useState(initalTimeText);

  useEffect(() => {
    function changeTime(): void {
      setTime(moment(start).fromNow());
    }

    function calculateElapsedTime(): void {
      const diff = moment(new Date()).diff(start);

      const minutes = moment.duration(diff).asMinutes();

      if (minutes <= 60) {
        if (!intervalId.current) {
          intervalId.current = setInterval(() => {
            changeTime();
            calculateElapsedTime();
          }, ONE_MINUTE);
        }

        return;
      }

      clearInterval(intervalId.current!);
      changeTime();
    }

    calculateElapsedTime();

    return () => {
      clearInterval(intervalId.current!);
    };
  }, [start]);

  return (
    <p>
      {prefix} <span className={styles.bold}>{time}</span>
    </p>
  );
}
