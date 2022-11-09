import { useState, useEffect } from 'react';
import { debounce } from '../helpers/functions';

export function useWindowDimension() {
  const [dimension, setDimension] = useState([window.innerWidth, window.innerHeight]);
  useEffect(() => {
    const debouncedResizeHandler = debounce(() => {
      setDimension([window.innerWidth, window.innerHeight]);
    }, 10);
    window.addEventListener('resize', debouncedResizeHandler);
    return () => window.removeEventListener('resize', debouncedResizeHandler);
  }, []);
  return dimension;
}
