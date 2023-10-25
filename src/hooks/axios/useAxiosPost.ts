import { api } from '@services/api';
import { AxiosRequestConfig } from 'axios';
import { useCallback, useState } from 'react';

export function useAxiosPost(params: AxiosRequestConfig) {
  const [state, setState] = useState({
    data: null,
    isLoading: false,
    isSucess: false,
    isError: false,
    error: '',
  });

  const post = useCallback(() => {
    setState((prevState) => ({ ...prevState, isLoading: true }));
    api
      .request(params)
      .then((response) => {
        setState((prevState) => ({
          ...prevState,
          isLoading: false,
          isSucess: true,
          data: response.data,
          error: '',
        }));
      })
      .catch((error) => {
        setState((prevState) => ({
          ...prevState,
          isLoading: false,
          isSucess: false,
          data: null,
          isError: true,
          error: error.message,
        }));
      });
  }, [params]);

  return { post, state };
}
