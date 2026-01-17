import { useCallback } from 'react';

/**
 * Custom hook for standardized error handling
 * Usage: const handleError = useErrorHandler();
 *        handleError(error, 'Custom message');
 */
export const useErrorHandler = () => {
  return useCallback((error, defaultMessage = 'An error occurred') => {
    const errorMessage = error?.response?.data?.detail || 
                        error?.message || 
                        defaultMessage;
    
    console.error('Error:', errorMessage);
    return errorMessage;
  }, []);
};

/**
 * Custom hook for API calls with loading and error states
 */
export const useAsync = (asyncFunction, immediate = true) => {
  const [status, setStatus] = React.useState('idle');
  const [value, setValue] = React.useState(null);
  const [error, setError] = React.useState(null);

  const execute = React.useCallback(async (...args) => {
    setStatus('pending');
    setValue(null);
    setError(null);
    try {
      const response = await asyncFunction(...args);
      setValue(response);
      setStatus('success');
      return response;
    } catch (err) {
      setError(err);
      setStatus('error');
      throw err;
    }
  }, [asyncFunction]);

  React.useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  return { execute, status, value, error };
};
