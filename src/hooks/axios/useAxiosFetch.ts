import { api } from '@services/api';
import { AxiosRequestConfig } from 'axios';
import { useEffect, useState } from 'react';

export function useAxiosFetch(params: AxiosRequestConfig) {
  const [state, setState] = useState({
    data: null,
    isLoading: true,
    isSucess: false,
    isError: false,
    error: '',
  });

  useEffect(() => {
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
        console.log(error);
        setState((prevState) => ({
          ...prevState,
          isLoading: false,
          isSucess: false,
          data: null,
          isError: true,
          error: error.message,
        }));
      });
  }, []);

  return { state };
}
