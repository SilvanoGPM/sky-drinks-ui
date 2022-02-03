import { Html5QrcodeScanner } from 'html5-qrcode';
import { useEffect } from 'react';

interface QRCodeScannerProps {
  fps: number;
  qrbox: number;
  verbose?: boolean;
  onSuccess: (decodedText: string) => void;
  onError: () => void;
}

const qrcodeID = 'html5qr-code-full-region';

export function QRCodeScanner({
  fps,
  qrbox,
  verbose = false,
  onSuccess,
  onError,
}: QRCodeScannerProps): JSX.Element {
  useEffect(() => {
    const config = {
      fps,
      qrbox,
      onSuccess,
    };

    const html5QrcodeScanner = new Html5QrcodeScanner(
      qrcodeID,
      config,
      verbose
    );

    html5QrcodeScanner.render(onSuccess, onError);

    return () => {
      html5QrcodeScanner?.clear().catch((error) => {
        console.error('Failed to clear html5QrcodeScanner. ', error);
      });
    };
  }, [fps, qrbox, verbose, onSuccess, onError]);

  return <div id={qrcodeID} />;
}
