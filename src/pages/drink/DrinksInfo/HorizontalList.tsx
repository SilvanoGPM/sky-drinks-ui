import { ReactNode, useRef } from 'react';
import useDraggableScroll from 'use-draggable-scroll';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { Empty } from 'antd';

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
  fallbackErrorMessage?: string;
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
}: HorizontalListProps): JSX.Element {
  const drinksRef = useRef<HTMLUListElement>(null);

  const { onMouseDown } = useDraggableScroll(drinksRef);

  function scroll(offset: number): void {
    const list = drinksRef.current;

    if (list) {
      list.scroll({ behavior: 'smooth', left: list.scrollLeft + offset });
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
    <Empty description={emptyDescription} />
  ) : (
    <>
      {title}

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
