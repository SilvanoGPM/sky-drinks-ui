import { useEffect, useRef } from 'react';
import QRCode from 'easyqrcodejs';

import styles from './styles.module.scss';

interface QRCodeGeneratorProps {
  text: string;
}

export function QRCodeGenerator({
  text = '',
}: QRCodeGeneratorProps): JSX.Element {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current !== null) {
      new QRCode(ref.current, {
        text,
        logo: `${process.env.PUBLIC_URL}/favicon_black.png`,
        logoWidth: 40,
        logoHeight: 40,
        width: 150,
        height: 150,
        logoBackgroundColor: '#ffffff',
      });
    }
  }, [text]);

  return <div ref={ref} className={styles.container} />;
}
