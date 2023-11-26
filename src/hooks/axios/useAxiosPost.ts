/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from '@services/api';
import { AxiosRequestConfig } from 'axios';
import { useCallback, useState } from 'react';

export function useAxiosPost<Type>() {
  const [postState, setPostState] = useState({
    data: [] as Type,
    isLoading: false,
    isSucess: false,
    isError: false,
    error: '',
  });

  async function postData(params: AxiosRequestConfig) {
    setPostState((prevState) => ({ ...prevState, isLoading: true }));
    api
      .request(params)
      .then((response) => {
        setPostState((prevState) => ({
          ...prevState,
          isLoading: false,
          isSucess: true,
          data: response.data,
          error: '',
        }));
      })
      .catch((error) => {
        setPostState((prevState) => ({
          ...prevState,
          isLoading: false,
          isSucess: false,
          data: [] as Type,
          isError: true,
          error: error.message,
        }));
      });
  }

  const postMultipleData = useCallback(async (params: AxiosRequestConfig) => {
    setPostState((prevState) => ({ ...prevState, isLoading: true }));
    api
      .request({ ...params })
      .then((response) => {
        setPostState((prevState) => ({
          ...prevState,
          isLoading: false,
          isSucess: true,
          data: response.data,
          error: '',
        }));
      })
      .catch((error) => {
        setPostState((prevState) => ({
          ...prevState,
          isLoading: false,
          isSucess: false,
          data: [] as Type,
          isError: true,
          error: error.message,
        }));
      });
  }, []);

  return { postState, postData, postMultipleData };
}
