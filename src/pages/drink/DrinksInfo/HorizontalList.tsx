import { ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import useDraggableScroll from 'use-draggable-scroll';
import { Empty, Switch } from 'antd';

import {
  LeftOutlined,
  PauseOutlined,
  PlayCircleOutlined,
  RightOutlined,
} from '@ant-design/icons';

import { SpinLoadingIndicator } from 'src/components/other/LoadingIndicator';
import { handleError } from 'src/utils/handleError';

import { DrinkCard } from '../components/DrinkCard';

import styles from './styles.module.scss';

interface HorizontalListProps {
  emptyDescription: string;
  drinks?: DrinkType[];
  title?: ReactNode;
  error?: unknown;
  isError?: boolean;
  loading?: boolean;
  scrollOffset?: number;
  autoScrollTimeout?: number;
  fallbackErrorMessage?: string;
  playing: boolean;
  setPlaying: (playing: boolean) => void;
}

export function HorizontalList({
  emptyDescription,
  error,
  drinks = [],
  title,
  fallbackErrorMessage = '',
  isError = false,
  loading = false,
  scrollOffset = 500,
  autoScrollTimeout = 1000,
  playing,
  setPlaying,
}: HorizontalListProps): JSX.Element {
  const drinksRef = useRef<HTMLUListElement | null>(null);

  const { onMouseDown } = useDraggableScroll(drinksRef);

  const [intervalId, setIntervalId] = useState<NodeJS.Timeout>();
  const [loaded, setLoaded] = useState<boolean>(false);

  const animateScroll = useCallback(
    (list: HTMLUListElement) => {
      if (!playing) {
        return;
      }

      const newIntervalId = setInterval(() => {
        const scrollWidth = list.scrollWidth - list.clientWidth;

        const left =
          list.scrollLeft >= scrollWidth ? 0 : list.scrollLeft + scrollOffset;

        list.scroll({ behavior: 'smooth', left });
      }, autoScrollTimeout);

      setIntervalId(newIntervalId);
    },
    [playing, autoScrollTimeout, scrollOffset]
  );

  useEffect(() => {
    if (!playing && intervalId) {
      setLoaded(false);
      clearInterval(intervalId);
      return;
    }

    if (!loaded) {
      setTimeout(() => {
        const list = drinksRef.current;

        if (list) {
          setLoaded(true);
          animateScroll(list);
        }
      }, autoScrollTimeout);
    }
  }, [playing, intervalId, animateScroll, autoScrollTimeout, loaded]);

  function scroll(offset: number): void {
    const list = drinksRef.current;

    if (list) {
      list.scroll({ behavior: 'smooth', left: list.scrollLeft + offset });

      if (intervalId) {
        clearInterval(intervalId);
        animateScroll(list);
      }
    }
  }

  function scrollPrev(): void {
    scroll(-scrollOffset);
  }

  function scrollNext(): void {
    scroll(scrollOffset);
  }

  if (isError) {
    handleError({
      error,
      fallback: fallbackErrorMessage,
    });

    return <></>;
  }

  if (loading) {
    return (
      <div className={styles.loading}>
        {title}
        <SpinLoadingIndicator />
      </div>
    );
  }

  return drinks.length === 0 ? (
    <Empty style={{ marginTop: '2rem' }} description={emptyDescription} />
  ) : (
    <>
      <div className={styles.header}>
        {title}
        <Switch
          className={styles.switch}
          checkedChildren={<PlayCircleOutlined />}
          unCheckedChildren={<PauseOutlined />}
          defaultChecked
          checked={playing}
          onChange={setPlaying}
        />
      </div>

      <div className={styles.listContainer}>
        <button
          className={`${styles.controlButton} ${styles.prevButton}`}
          type="button"
          onClick={scrollPrev}
        >
          <LeftOutlined style={{ fontSize: '2rem' }} />
        </button>
        <button
          className={`${styles.controlButton} ${styles.nextButton}`}
          type="button"
          onClick={scrollNext}
        >
          <RightOutlined style={{ fontSize: '2rem' }} />
        </button>

        <ul
          role="listbox"
          ref={drinksRef}
          onMouseDown={onMouseDown}
          className={styles.listDrinks}
        >
          {drinks.map((props: DrinkType) => (
            <div key={props.uuid} className={styles.cardContainer}>
              <DrinkCard
                width="50%"
                minWidth={260}
                imageHeight={260}
                loading={loading}
                {...props}
              />
            </div>
          ))}
        </ul>
      </div>
    </>
  );
}
