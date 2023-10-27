import { useFocusEffect } from '@react-navigation/native';
import { api } from '@services/api';
import { AxiosRequestConfig } from 'axios';
import { useCallback, useState } from 'react';

type Request<T> = {
  data: T;
  isLoading: boolean;
  isSucess: boolean;
  isError: boolean;
  error: string;
};

export function useAxiosFetch<T>(params: AxiosRequestConfig) {
  const [state, setState] = useState<Request<T>>({
    data: [] as T,
    isLoading: true,
    isSucess: false,
    isError: false,
    error: '',
  });

  useFocusEffect(
    useCallback(() => {
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
            data: [] as T,
            isError: true,
            error: error.message,
          }));
        });
    }, [])
  );

  // useEffect(() => {
  //   setState((prevState) => ({ ...prevState, isLoading: true }));
  //   api
  //     .request(params)
  //     .then((response) => {
  //       setState((prevState) => ({
  //         ...prevState,
  //         isLoading: false,
  //         isSucess: true,
  //         data: response.data,
  //         error: '',
  //       }));
  //     })
  //     .catch((error) => {
  //       setState((prevState) => ({
  //         ...prevState,
  //         isLoading: false,
  //         isSucess: false,
  //         data: [] as T,
  //         isError: true,
  //         error: error.message,
  //       }));
  //     });
  // }, []);

  return { state };
}
