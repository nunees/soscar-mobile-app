/* eslint-disable import/no-extraneous-dependencies */
import { AppHeader } from '@components/AppHeader';
import { Button } from '@components/Button';
import { ILegalQuote } from '@dtos/ILegalQuote';
import { useAuth } from '@hooks/useAuth';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { PartnerNavigatorRoutesProps } from '@routes/partner.routes';
import { api } from '@services/api';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { Heading, VStack, Text } from 'native-base';
import React, { useState, useCallback } from 'react';
import { Vibration } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export function ValidateDocument() {
  const [hasPermission, setHasPermission] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [serverResponse, setServerResponse] = useState<ILegalQuote[]>(
    {} as ILegalQuote[]
  );

  const { user } = useAuth();

  const partnerNavigation = useNavigation<PartnerNavigatorRoutesProps>();
  const userNavigation = useNavigation<PartnerNavigatorRoutesProps>();

  useFocusEffect(
    useCallback(() => {
      (async () => {
        setIsCameraOpen(true);
        const { status } = await BarCodeScanner.requestPermissionsAsync();
        if (status === 'granted') {
          setHasPermission(true);
        } else {
          setHasPermission(false);
        }
      })();
      return () => {
        setIsCameraOpen(false);
        setServerResponse([]);
      };
    }, [])
  );

  async function grantAccess() {
    const { status } = await BarCodeScanner.requestPermissionsAsync();
    setHasPermission(status === 'granted');
  }

  const handleBarCodeScanned = async ({ type, data }) => {
    try {
      Vibration.vibrate(100);
      setIsCameraOpen(false);
      const response = await api.get(`/legal/hash/${data}`, {
        headers: {
          id: user.id,
        },
      });

      if (response.data.length === 0 || response.status === 404) {
        setServerResponse([]);
        return;
      }

      setServerResponse(response.data);
    } catch (error) {
      setServerResponse([]);
    }
  };

  const renderCamera = () => {
    return (
      <VStack
        mt={10}
        width={400}
        height={400}
        overflow={'hidden'}
        borderRadius={0}
        style={{ aspectRatio: 1 }}
      >
        <BarCodeScanner
          onBarCodeScanned={isCameraOpen ? handleBarCodeScanned : undefined}
          style={{ flex: 1 }}
        />
      </VStack>
    );
  };

  if (hasPermission === null) {
    <SafeAreaView>
      <VStack px={5} mt={10}>
        <VStack background={'white'} p={3}>
          <Text fontSize={'lg'} bold color={'red.500'} textAlign={'center'}>
            Não é possível continuar
          </Text>
          <Text fontSize={'lg'} textAlign={'center'}>
            Você deve permitir o acesso a câmera para continuar
          </Text>
        </VStack>
      </VStack>
      <VStack px={5} py={5}>
        <VStack p={3} borderRadius={10}>
          <Button onPress={grantAccess} title="Permitir acesso" />
        </VStack>
      </VStack>
    </SafeAreaView>;
  }

  if (hasPermission === false) {
    return (
      <SafeAreaView>
        <VStack px={5} mt={10}>
          <VStack background={'white'} p={3}>
            <Text fontSize={'lg'} bold color={'red.500'} textAlign={'center'}>
              Não é possível continuar
            </Text>
            <Text fontSize={'lg'} textAlign={'center'}>
              Você deve permitir o acesso a câmera para continuar
            </Text>
          </VStack>
        </VStack>
        <VStack px={5} py={5}>
          <VStack p={3} borderRadius={10}>
            <Button onPress={grantAccess} title="Permitir acesso" />
          </VStack>
        </VStack>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView>
      <VStack>
        <AppHeader
          title="Validação de documento"
          navigation={user.isPartner ? partnerNavigation : userNavigation}
          screen={'home'}
        />
      </VStack>

      {isCameraOpen && renderCamera()}

      <VStack px={5} py={5}>
        {isCameraOpen && (
          <VStack px={2}>
            <VStack background={'white'} p={3} borderRadius={10}>
              <Text textAlign={'center'} fontSize={'md'} color="gray.600">
                Aponte a camera para o Qr Code para escanear.{'\n'}Ela vai focar
                no código depois de alguns segundos.{'\n'}
                Veja se o código QR está centralizado na tela. As quatro pontas
                do código devem aparecer da tela de escaneamento.
              </Text>
            </VStack>
          </VStack>
        )}
        {serverResponse && serverResponse.length > 0 && (
          <Heading color={'green.700'} textAlign={'center'} pb={5}>
            O documento e válido!
          </Heading>
        )}

        {!serverResponse[0] && !isCameraOpen && (
          <Heading color={'red.500'} textAlign={'center'}>
            Esta chave não pertence a nenhum documento
          </Heading>
        )}
        {serverResponse && serverResponse.length > 0 && (
          <Text fontSize={'md'} textAlign={'center'}>
            A chave informada pertence a um documento de orçamento informado,
            sendo assim, fica garantido a sua <Text bold>autenticidade</Text>
          </Text>
        )}
        {!serverResponse[0] && !isCameraOpen && (
          <Text fontSize={'md'} textAlign={'center'}>
            O código informado <Text bold>não pertence</Text> a nenhum documento
            de orçamento armazenado em nossos servidores.
          </Text>
        )}
      </VStack>
      {!isCameraOpen && (
        <VStack px={5} py={5}>
          <Button
            onPress={() => {
              setIsCameraOpen(true);
              setServerResponse([]);
            }}
            title="Escanear novamente"
          />
        </VStack>
      )}
    </SafeAreaView>
  );
}
