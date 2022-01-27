import { SpringValue, useSpring } from 'react-spring';

export function useZoomInAnimation(): [Record<string, SpringValue<number>>] {
  const props = useSpring({
    from: { opacity: 0, scale: -1 },
    to: { opacity: 1, scale: 1 },
    config: {
      tension: 300,
      friction: 20,
    },
  });

  return [props];
}
