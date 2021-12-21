import { useEffect, useState } from 'react';

type FaviconColors = "black" | "blue" | "red" | "green";

function getFavicon() {
  return document.querySelector("#favicon");
}

function setFavicon(color: FaviconColors = "black") {
  getFavicon()?.setAttribute('href', `${process.env.PUBLIC_URL}/favicon_${color}.png`);
}

export function useFavicon(initialColor: FaviconColors = "black") {

  const [color, setColor] = useState(initialColor);

  useEffect(() => {
    setFavicon(color);
    return () => setFavicon("black");
  }, [color]);

  return { color, setColor };
}
