import { useMemo, useEffect, useState, useContext } from 'react';

import { BrowserPermissionsContext } from 'src/contexts/BrowserPermissionsContext';

export function useAudio(url: string): [() => void, boolean] {
  const { permissions } = useContext(BrowserPermissionsContext);
  const audio = useMemo(() => new Audio(url), [url]);

  const [playing, setPlaying] = useState(false);

  function toggle(): void {
    if (permissions.sound) {
      setPlaying(!playing);
    }
  }

  useEffect(() => {
    if (playing) {
      audio.play();
    } else {
      audio.pause();
    }
  }, [playing, audio]);

  useEffect(() => {
    audio.addEventListener('ended', () => setPlaying(false));

    return () => {
      audio.removeEventListener('ended', () => setPlaying(false));
    };
  }, [audio]);

  return [toggle, playing];
}
