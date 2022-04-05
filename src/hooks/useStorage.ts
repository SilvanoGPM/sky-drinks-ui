import { useEffect, useState } from 'react';

import Repository from 'src/lib/Repository';

type UseStorageReturn<T> = [
  T,
  React.Dispatch<React.SetStateAction<T>>,
  boolean
];

type UseStorageOptionsCallback<T> = (value: T) => boolean;

interface UseStorageOptions<T> {
  depends: UseStorageOptionsCallback<T> | boolean;
}

export function useStorage<T>(
  key: string,
  initialValue: T,
  options: UseStorageOptions<T> = { depends: true }
): UseStorageReturn<T> {
  const [loading, setLoading] = useState<boolean>(true);
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  useEffect(() => {
    function loadStoredValue(): void {
      const valueFound = Repository.get<T>(key);

      const notEmptyValue = valueFound !== undefined && valueFound !== null;

      const hasValid =
        notEmptyValue &&
        ((typeof options.depends === 'function' &&
          options.depends(valueFound)) ||
          options.depends);

      if (hasValid) {
        setStoredValue(valueFound);
      }

      setLoading(false);
    }

    if (loading) {
      loadStoredValue();
    }
  }, [key, options, loading]);

  useEffect(() => {
    function storeValue(): void {
      Repository.save<T>(key, storedValue);
    }

    if (!loading && options.depends) {
      storeValue();
    }
  }, [storedValue, loading, options, key]);

  return [storedValue, setStoredValue, loading];
}
