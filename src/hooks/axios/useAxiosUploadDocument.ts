import { api } from '@services/api';
import { AxiosRequestConfig } from 'axios';
import { useState, useCallback } from 'react';

export function useAxiosUploadDocument(
  params: AxiosRequestConfig,
  data: FormData | null
) {
  const [documentState, setDocumentState] = useState({
    data: null,
    isLoading: false,
    isSucess: false,
    isError: false,
    error: '',
  });

  const document = useCallback(() => {
    setDocumentState((prevState) => ({ ...prevState, isLoading: true }));

    data?.forEach((form) => {
      api
        .request({
          ...params,
          data: form,
        })
        .then((response) => {
          setDocumentState((prevState) => ({
            ...prevState,
            isLoading: false,
            isSucess: true,
            data: response.data,
            error: '',
          }));
        })
        .catch((error) => {
          setDocumentState((prevState) => ({
            ...prevState,
            isLoading: false,
            isSucess: false,
            data: null,
            isError: true,
            error: error.message,
          }));
        });
    });
  }, [params]);

  return { document, documentState };
}
