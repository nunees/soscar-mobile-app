import { useFocusEffect } from '@react-navigation/native';
import {
  Accuracy,
  LocationObjectCoords,
  getCurrentPositionAsync,
  requestForegroundPermissionsAsync,
} from 'expo-location';
import { useCallback, useState } from 'react';

export function useGPS() {
  const [position, setPosition] = useState({
    coords: {} as LocationObjectCoords,
    isLoading: true,
    isError: false,
    isSucess: false,
    error: '',
  });

  useFocusEffect(
    useCallback(() => {
      requestForegroundPermissionsAsync()
        .then((response) => {
          if (response.granted) {
            getCurrentPositionAsync({
              accuracy: Accuracy.High,
            })
              .then((response) => {
                setPosition({
                  coords: response.coords,
                  isLoading: false,
                  isError: false,
                  isSucess: true,
                  error: '',
                });
              })
              .catch((error) => {
                setPosition({
                  coords: {} as LocationObjectCoords,
                  isLoading: false,
                  isError: true,
                  isSucess: false,
                  error,
                });
              });
          }
        })
        .catch((error) => {
          setPosition({
            coords: {} as LocationObjectCoords,
            isLoading: false,
            isError: true,
            isSucess: false,
            error,
          });
        });
    }, [])
  );
  // useEffect(() => {
  //   requestForegroundPermissionsAsync()
  //     .then((response) => {
  //       if (response.granted) {
  //         getCurrentPositionAsync({
  //           accuracy: 6,
  //         })
  //           .then((response) => {
  //             setPosition({
  //               coords: response.coords,
  //               isLoading: false,
  //               isError: false,
  //               isSucess: true,
  //               error: '',
  //             });
  //           })
  //           .catch((error) => {
  //             setPosition({
  //               coords: {} as LocationObjectCoords,
  //               isLoading: false,
  //               isError: true,
  //               isSucess: false,
  //               error,
  //             });
  //           });
  //       }
  //     })
  //     .catch((error) => {
  //       setPosition({
  //         coords: {} as LocationObjectCoords,
  //         isLoading: false,
  //         isError: true,
  //         isSucess: false,
  //         error,
  //       });
  //     });
  // }, []);

  return { position };
}
