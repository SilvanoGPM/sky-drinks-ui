import { useEffect, useState } from 'react';

type FaviconColors = 'black' | 'blue' | 'red' | 'green';

interface UseFaviconReturn {
  color: FaviconColors;
  setColor: React.Dispatch<React.SetStateAction<FaviconColors>>;
}

function getFavicon(): Element | null {
  return document.querySelector('#favicon');
}

function setFavicon(color: FaviconColors = 'black'): void {
  getFavicon()?.setAttribute(
    'href',
    `${process.env.PUBLIC_URL}/favicon_${color}.png`
  );
}

export function useFavicon(
  initialColor: FaviconColors = 'black'
): UseFaviconReturn {
  const [color, setColor] = useState(initialColor);

  useEffect(() => {
    setFavicon(color);
    return () => setFavicon('black');
  }, [color]);

  return { color, setColor };
}
