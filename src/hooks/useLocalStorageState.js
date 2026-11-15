import { useEffect, useState } from 'react';

function readStoredValue(key, initialValue) {
  if (typeof window === 'undefined') return initialValue;

  try {
    const storedValue = window.localStorage.getItem(key);
    return storedValue === null ? initialValue : JSON.parse(storedValue);
  } catch (error) {
    console.error(`Could not read local storage key "${key}".`, error);
    return initialValue;
  }
}

function useLocalStorageState(key, initialValue) {
  const [value, setValue] = useState(() => readStoredValue(key, initialValue));

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Could not save local storage key "${key}".`, error);
    }
  }, [key, value]);

  return [value, setValue];
}

export default useLocalStorageState;
