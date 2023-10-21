// import axios, { AxiosError, AxiosRequestConfig } from 'axios';
// import { useEffect, useRef, useState } from 'react';

// // eslint-disable-next-line @typescript-eslint/no-explicit-any
// export function useAxios<T, D = any>(axiosParams: AxiosRequestConfig<D>) {
//   const [response, setResponse] = useState<T | null>(null);
//   const [error, setError] = useState<AxiosError | unknown>(null);
//   const [loading, setLoading] = useState(true);
//   const controllerRef = useRef(new AbortController());
//   const cancelRequest = () => controllerRef.current.abort();

//   useEffect(() => {
//     const fetchData = async (params: AxiosRequestConfig<D>) => {
//       try {
//         const result = await axios.request<T>({
//           ...params,
//           signal: controllerRef.current.signal,
//         });
//         setResponse(result.data);
//       } catch (error: AxiosError | unknown) {
//         if (axios.isAxiosError(error)) {
//           setError(error);
//         } else {
//           setError(error);
//         }
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData(axiosParams);
//   }, [axiosParams]);

//   return { response, error, loading, cancelRequest };
// }
