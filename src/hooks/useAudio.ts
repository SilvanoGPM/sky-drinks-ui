import { useMemo, useEffect, useState, useContext } from "react";
import { BrowserPermissionsContext } from "src/contexts/BrowserPermissionsContext";

export function useAudio(url: string) {
  const { soundPermission } = useContext(BrowserPermissionsContext);
  const audio = useMemo(() => new Audio(url), [url]);

  const [playing, setPlaying] = useState(false);

  const toggle = () => setPlaying(!playing);

  useEffect(() => {
    playing && soundPermission ? audio.play() : audio.pause();
  }, [playing, audio, soundPermission]);

  useEffect(() => {
    audio.addEventListener("ended", () => setPlaying(false));
    return () => {
      audio.removeEventListener("ended", () => setPlaying(false));
    };
  }, [audio]);

  return { playing, toggle };
}
