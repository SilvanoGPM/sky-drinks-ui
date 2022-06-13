import { useEffect, useState } from 'react';

import Repository from 'src/libs/Repository';

type UseStorageReturn<T> = [
  T,
  React.Dispatch<React.SetStateAction<T>>,
  boolean
];

export function useStorage<T>(
  key: string,
  initialValue: T
): UseStorageReturn<T> {
  const [loading, setLoading] = useState<boolean>(true);
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  useEffect(() => {
    const valueFound = Repository.get<T>(key);

    if (valueFound !== undefined && valueFound !== null) {
      setStoredValue(valueFound);
    }

    setLoading(false);
  }, [key]);

  useEffect(() => {
    if (!loading) {
      Repository.save<T>(key, storedValue);
    }
  }, [storedValue, loading, key]);

  return [storedValue, setStoredValue, loading];
}
