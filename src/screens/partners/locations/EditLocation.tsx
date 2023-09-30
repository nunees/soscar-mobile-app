import { AppHeader } from '@components/AppHeader';
import { Button } from '@components/Button';
import ButtonSelection from '@components/ButtonSelection';
import { Input } from '@components/Input';
import { LoadingModal } from '@components/LoadingModal';
import { TextArea } from '@components/TextArea';
import { ILocation } from '@dtos/ILocation';
import { useAuth } from '@hooks/useAuth';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import { PartnerNavigatorRoutesProps } from '@routes/partner.routes';
import { api } from '@services/api';
import { AppError } from '@utils/AppError';
import { ConvertAddressToLatLong } from '@utils/CalculatePositionDistance';
import { GetAddressByCEP } from '@utils/GetAddressByCEP';
import { VStack, Text, useToast, ScrollView, HStack } from 'native-base';
import { useState, useCallback, useEffect } from 'react';

type RouteParamProps = {
  locationId: string;
};

const payment_methods = [
  { id: 1, name: 'Dinheiro' },
  { id: 2, name: 'Crédito' },
  { id: 3, name: 'Débito' },
  { id: 4, name: 'PIX' },
  { id: 5, name: 'Transferencia' },
  { id: 6, name: 'Outros' },
];

const services_types = [
  { id: 1, name: 'Acessorios' },
  { id: 2, name: 'Cambio' },
  { id: 3, name: 'Eletrica' },
  { id: 4, name: 'Fluidos' },
  { id: 5, name: 'Funilaria e Pintura' },
  { id: 6, name: 'Lavagem' },
  { id: 7, name: 'Mecanica' },
  { id: 8, name: 'Pneus' },
  { id: 9, name: 'Suspensão' },
  { id: 10, name: 'Vidros' },
  { id: 11, name: 'Outros' },
];

type paymentType = {
  id: number;
  name: string;
};

type servicesType = {
  id: number;
  name: string;
};

export function EditLocation() {
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [location, setLocation] = useState<ILocation>({} as ILocation);

  const routes = useRoute();
  const toast = useToast();

  const { user } = useAuth();

  const { locationId } = routes.params as RouteParamProps;
  const navigation = useNavigation<PartnerNavigatorRoutesProps>();

  const [openHour, setOpenHour] = useState('');
  const [closeHour, setCloseHour] = useState('');

  const setPaymentMethodsHandler = useCallback(
    (value: number) => {
      const alreadySelected = location.payment_methods?.includes(value);
      if (alreadySelected === undefined) {
        setLocation((prevState) => ({
          ...prevState,
          payment_methods: [value],
        }));
        return;
      }

      if (!alreadySelected) {
        setLocation((prevState) => ({
          ...prevState,
          payment_methods: [...prevState.payment_methods!, value],
        }));
        return;
      }

      if (alreadySelected) {
        setLocation((prevState) => ({
          ...prevState,
          payment_methods: prevState.payment_methods?.filter(
            (item) => item !== value
          ),
        }));
      }
    },
    [location.payment_methods]
  );

  const setServicesHandler = useCallback(
    (value: number) => {
      const alreadySelected = location.business_categories?.includes(value);
      if (alreadySelected === undefined) {
        setLocation((prevState) => ({
          ...prevState,
          business_categories: [value],
        }));
        return;
      }

      if (!alreadySelected) {
        setLocation((prevState) => ({
          ...prevState,
          business_categories: [...prevState.business_categories!, value],
        }));
        return;
      }

      if (alreadySelected) {
        setLocation((prevState) => ({
          ...prevState,
          business_categories: prevState.business_categories?.filter(
            (item) => item !== value
          ),
        }));
      }
    },
    [location.business_categories]
  );

  const handleSubmitBusiness = useCallback(async () => {
    try {
      setMessage('Salvando local...');
      setIsUploading(true);

      console.log(`LOCATION: `);
      console.log(location);

      // await api.patch(
      //   `/locations/${location.id}`,
      //   {
      //     cnpj: location.cnpj,
      //     business_name: location.business_name,
      //     business_phone: location.business_phone,
      //     business_email: location.business_email,
      //     address_line: location.address_line,
      //     number: Number(location.number),
      //     district: location.district,
      //     city: location.city,
      //     state: location.state,
      //     zipcode: location.zipcode,
      //     latitude: location.latitude,
      //     longitude: location.longitude,
      //     payment_methods: location.payment_methods,
      //     business_categories: location.business_categories,
      //     open_hours: `${openHour} - ${closeHour}`,
      //     open_hours_weekend: location.open_hours_weekend,
      //     business_description: location.business_description,
      //   },
      //   {
      //     headers: {
      //       id: user.id,
      //     },
      //   }
      // );

      setIsUploading(false);
      toast.show({
        title: 'Local cadastrado com sucesso!',
        placement: 'top',
        bgColor: 'green.500',
      });
      // navigation.navigate('locations');
    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError ? error.message : 'Erro ao realizar cadastro';
      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500',
      });
    } finally {
      setIsUploading(false);
    }
  }, []);

  const handleCEP = useCallback(async (value: string) => {
    try {
      setIsUploading(true);
      setMessage('Verificando CEP...');
      if (value.length === 8) {
        const address = await GetAddressByCEP(value);
        if (address.data.erro || !address.data.logradouro) {
          throw new AppError('CEP invalido');
        }
        const location = await ConvertAddressToLatLong(
          `${address.data.logradouro}, ${address.data.bairro} - ${address.data.uf}`
        );
        if (!location) {
          throw new AppError('Endereço invalido');
        }

        setLocation((prevState) => ({
          ...prevState,
          address_line: address.data.logradouro,
          district: address.data.bairro,
          city: address.data.localidade,
          state: address.data.uf,
          zipcode: address.data.cep,
          latitude: String(location?.latitude),
          longitude: String(location?.longitude),
        }));
      }
    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError ? error.message : 'O CEP informado é invalido';
      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500',
      });
    } finally {
      setIsUploading(false);
    }
  }, []);

  const handleOpenDays = useCallback(
    (value: string) => {
      const alreadySelected = location.open_hours_weekend?.includes(value);
      if (alreadySelected === undefined) {
        setLocation((prevState) => ({
          ...prevState,
          open_hours_weekend: [value],
        }));
        return;
      }

      if (!alreadySelected) {
        setLocation((prevState) => ({
          ...prevState,
          open_hours_weekend: [...prevState.open_hours_weekend!, value],
        }));
        return;
      }

      if (alreadySelected) {
        setLocation((prevState) => ({
          ...prevState,
          open_hours_weekend: prevState.open_hours_weekend?.filter(
            (item) => item !== value
          ),
        }));
      }
    },
    [location.open_hours_weekend]
  );

  const handleHour = useCallback((date: Date | undefined, state: string) => {
    if (date) {
      const tempDate = date
        .toLocaleTimeString()
        .split(':')
        .slice(0, 2)
        .join(':');
      if (state === 'open') {
        setOpenHour(tempDate);
      } else if (state === 'close') {
        setCloseHour(tempDate);
      }
    }
  }, []);

  const handleFetchLocationDetails = useCallback(async () => {
    try {
      const response = await api.get(`/locations/${locationId}`, {
        headers: {
          id: user.id,
        },
      });

      setLocation(response.data);
    } catch (error) {
      throw new AppError('Erro ao carregar detalhes do local');
    }
  }, []);

  useEffect(() => {
    handleFetchLocationDetails();
  }, []);

  return (
    <VStack>
      <VStack>
        <AppHeader title="Editar local" />
      </VStack>
      {isUploading && (
        <LoadingModal
          showModal={isUploading}
          setShowModal={setIsUploading}
          message={message}
        />
      )}

      <VStack>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 200 }}
          style={{
            paddingTop: 20,
          }}
        >
          <VStack px={5}>
            <VStack p={5} mt={5} borderRadius={10} backgroundColor="white">
              <Text fontSize="md" bold mb={3}>
                Informacoes pessoais
              </Text>
              <Input
                placeholder="CNPJ ou CPF"
                value={location.cnpj}
                keyboardType="numeric"
                onChangeText={(value) => {
                  setLocation((prevState) => ({
                    ...prevState,
                    cnpj: value,
                  }));
                }}
              />

              <Input
                placeholder="Nome Fantasia"
                value={location.business_name}
                onChangeText={(value) => {
                  setLocation((prevState) => ({
                    ...prevState,
                    business_name: value,
                  }));
                }}
              />
              <Input
                placeholder="Telefone"
                value={location.business_phone}
                onChangeText={(value) => {
                  setLocation((prevState) => ({
                    ...prevState,
                    business_phone: value,
                  }));
                }}
              />
              <Input
                placeholder="Email"
                value={location.business_email}
                onChangeText={(value) => {
                  setLocation((prevState) => ({
                    ...prevState,
                    business_email: value,
                  }));
                }}
              />
            </VStack>

            <VStack mb={5} p={5} backgroundColor="white" borderRadius={10}>
              <Text fontSize="md" bold mb={3}>
                Localizaçao
              </Text>

              <Input
                w={200}
                placeholder="CEP"
                value={location.zipcode}
                keyboardType="numeric"
                onChangeText={(value) => handleCEP(value)}
              />

              <Input
                placeholder="Endereço"
                value={location.address_line}
                onChangeText={(value) => {
                  setLocation((prevState) => ({
                    ...prevState,
                    address_line: value,
                  }));
                }}
                editable={false}
                isDisabled={true}
                caretHidden={true}
                showSoftInputOnFocus={false}
              />
              <Input
                placeholder="Número"
                onChangeText={(value) => {
                  setLocation((prevState) => ({
                    ...prevState,
                    number: Number(value),
                  }));
                }}
                value={String(location.number)}
              />
              <Input
                placeholder="Bairro"
                value={location.district}
                onChangeText={(value) => {
                  setLocation((prevState) => ({
                    ...prevState,
                    district: value,
                  }));
                }}
                editable={false}
                isDisabled={true}
                caretHidden={true}
                showSoftInputOnFocus={false}
              />
              <Input
                placeholder="Cidade"
                value={location.city}
                onChangeText={(value) => {
                  setLocation((prevState) => ({
                    ...prevState,
                    city: value,
                  }));
                }}
                editable={false}
                isDisabled={true}
                caretHidden={true}
                showSoftInputOnFocus={false}
              />
              <Input
                placeholder="Estado"
                value={location.state}
                onChangeText={(value) => {
                  setLocation((prevState) => ({
                    ...prevState,
                    state: value,
                  }));
                }}
                editable={false}
                isDisabled={true}
                caretHidden={true}
                showSoftInputOnFocus={false}
              />
            </VStack>

            <VStack backgroundColor="white" p={5} borderRadius={10} mb={5}>
              <Text fontSize="md" mb={3} bold>
                Meios de pagamentos oferecidos
              </Text>
              <HStack flexWrap={'wrap'}>
                {payment_methods.map((item: paymentType) => (
                  <ButtonSelection
                    data={item.name}
                    isToggled={location.payment_methods?.includes(item.id)}
                    handleOpenDays={() => setPaymentMethodsHandler(item.id)}
                  />
                ))}
              </HStack>
            </VStack>

            <VStack backgroundColor="white" p={5} borderRadius={10} mb={5}>
              <Text fontSize="md" mb={3} bold>
                Tipos de serviços oferecidos
              </Text>
              <HStack flexWrap={'wrap'}>
                {services_types.map((item: servicesType) => (
                  <ButtonSelection
                    key={item.id}
                    data={item.name}
                    isToggled={location.business_categories?.includes(item.id)}
                    handleOpenDays={() => setServicesHandler(item.id)}
                  />
                ))}
              </HStack>
            </VStack>

            <VStack backgroundColor="white" p={5} borderRadius={10} mb={5}>
              <Text fontSize="md" bold pb={5}>
                Aberto nos dias
              </Text>
              <HStack flexWrap={'wrap'}>
                <ButtonSelection
                  data={'Segunda'}
                  isToggled={location.open_hours_weekend?.includes('segunda')}
                  handleOpenDays={() => handleOpenDays('segunda')}
                />

                <ButtonSelection
                  data={'Terca'}
                  isToggled={location.open_hours_weekend?.includes('terca')}
                  handleOpenDays={() => handleOpenDays('terca')}
                />
                <ButtonSelection
                  data={'Quarta'}
                  isToggled={location.open_hours_weekend?.includes('quarta')}
                  handleOpenDays={() => handleOpenDays('quarta')}
                />
                <ButtonSelection
                  data={'Quinta'}
                  isToggled={location.open_hours_weekend?.includes('quinta')}
                  handleOpenDays={() => handleOpenDays('quinta')}
                />
                <ButtonSelection
                  data={'Sexta'}
                  isToggled={location.open_hours_weekend?.includes('sexta')}
                  handleOpenDays={() => handleOpenDays('sexta')}
                />
                <ButtonSelection
                  data={'Sabado'}
                  isToggled={location.open_hours_weekend?.includes('sabado')}
                  handleOpenDays={() => handleOpenDays('sabado')}
                />
                <ButtonSelection
                  data={'Domingo'}
                  isToggled={location.open_hours_weekend?.includes('domingo')}
                  handleOpenDays={() => handleOpenDays('domingo')}
                />
              </HStack>
            </VStack>

            <VStack backgroundColor="white" p={5} borderRadius={10} mb={5}>
              <Text fontSize="md" bold pb={5}>
                Horário de funcionamento
              </Text>
              <HStack>
                <VStack w={100}>
                  <Input
                    placeholder={'Abre'}
                    editable={false}
                    value={openHour || location?.open_hours?.split('-')[0]}
                    caretHidden
                    textAlign="center"
                    onPressIn={() => {
                      DateTimePickerAndroid.open({
                        mode: 'time',
                        is24Hour: true,
                        value: new Date(),
                        onChange: (event, date) => handleHour(date, 'open'),
                      });
                    }}
                  />
                </VStack>
                <VStack px={5} py={5}>
                  <Text>-</Text>
                </VStack>
                <VStack w={100}>
                  <Input
                    placeholder={'Fecha'}
                    editable={false}
                    value={closeHour || location.open_hours?.split('-')[1]}
                    caretHidden
                    textAlign="center"
                    onPressIn={() => {
                      DateTimePickerAndroid.open({
                        mode: 'time',
                        is24Hour: true,
                        value: new Date(),
                        onChange: (event, date) => handleHour(date, 'close'),
                      });
                    }}
                  />
                </VStack>
              </HStack>
            </VStack>

            <VStack backgroundColor="white" p={5} borderRadius={10} mb={5}>
              <Text bold pb={5}>
                Conte nos um pouco sobre o seu negócio
              </Text>
              <TextArea
                placeholder="Ele pode ser o diferencial para o cliente escolher o seu estabelecimento."
                h={150}
                value={location.business_description}
                onChangeText={(value) => {
                  setLocation((prevState) => ({
                    ...prevState,
                    business_description: value,
                  }));
                }}
                fontSize="sm"
                borderRadius={5}
              />
            </VStack>

            <Button
              title="Salvar alteracoes"
              onPress={handleSubmitBusiness}
              isLoading={isUploading}
            />
          </VStack>
        </ScrollView>
      </VStack>
    </VStack>
  );
}
