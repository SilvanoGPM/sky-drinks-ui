import { useEffect } from 'react';

export function useTitle(title: string): void {
  useEffect(() => {
    if (title) {
      document.title = title;
    }
  });
}
