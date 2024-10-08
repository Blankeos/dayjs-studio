/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Utility for debouncing.
 */
export const debounce = <A extends any[], R>(
  callback: (...args: A) => R,
  wait: number,
): ((...args: A) => Promise<R>) => {
  let timeoutId: number | null = null;

  const debouncedFunction = (...args: A): Promise<R> => {
    return new Promise((resolve, reject) => {
      if (timeoutId !== null) {
        window.clearTimeout(timeoutId);
      }

      timeoutId = window.setTimeout(() => {
        try {
          const result = callback(...args);
          resolve(result);
        } catch (error) {
          reject(error);
        }
      }, wait);
    });
  };

  debouncedFunction.cancel = () => {
    if (timeoutId !== null) {
      window.clearTimeout(timeoutId);
    }
  };

  return debouncedFunction;
};
