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
import { useState, useCallback } from 'react';

type RouteParamProps = {
  locationId: string;
};

const payment_types = [
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

function handleMultipleSelection(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  changeFunction: React.Dispatch<React.SetStateAction<any[]>>,
  state: unknown[],
  value: unknown
) {
  const alreadySelected = state.includes(value);

  if (alreadySelected === undefined) {
    changeFunction([value]);
    return;
  }
  if (!alreadySelected) {
    changeFunction([...state!, value]);
    return;
  }
  if (alreadySelected) {
    changeFunction(state?.filter((item) => item !== value));
  }
}

export function EditLocation() {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string>('');

  const [location, setLocation] = useState<ILocation>({} as ILocation);

  const [zipcode, setZipCode] = useState<string>('');

  const [payment_methods, setPaymentMethods] = useState<number[]>([]);
  const [openHoursWeekend, setOpenHoursWeekend] = useState<string[]>([]);
  const [business_categories, setBusinessCategories] = useState<number[]>([]);

  const [openHour, setOpenHour] = useState<string>('');
  const [closeHour, setCloseHour] = useState<string>('');

  const { user } = useAuth();
  const toast = useToast();
  const navigation = useNavigation<PartnerNavigatorRoutesProps>();

  const routes = useRoute();
  const { locationId } = routes.params as RouteParamProps;

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

  // eslint-disable-next-line consistent-return
  async function handleCepInput(cep: string) {
    try {
      setIsLoading(true);
      setMessage('Buscando endereço...');

      if (zipcode.length === 8) {
        const address = await GetAddressByCEP(cep);
        if (address.data.erro || !address.data.logradouro) {
          return null;
        }

        const position = await ConvertAddressToLatLong(
          `${address.data.logradouro}, ${address.data.bairro} - ${address.data.uf}`
        );

        if (position) {
          setLocation({
            ...location,
            address_line: address.data.logradouro,
            district: address.data.bairro,
            city: address.data.localidade,
            state: address.data.uf,
            zipcode: address.data.cep,
            latitude: String(position.latitude),
            longitude: String(position.longitude),
          });
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleSubmitBusiness = useCallback(async () => {
    try {
      setMessage('Salvando local...');
      setIsLoading(true);

      await api.patch(
        `/locations/${locationId}`,
        {
          cnpj: location.cnpj,
          business_name: location.business_name,
          business_phone: location.business_phone,
          business_email: location.business_email,
          address_line: location.address_line,
          number: Number(location.number),
          district: location.district,
          city: location.city,
          state: location.state,
          zipcode: location.zipcode,

          business_description: location.business_description,
          business_categories,
          payment_methods,

          open_hours: `${openHour} - ${closeHour}`,
          open_hours_weekend: openHoursWeekend,
        },
        {
          headers: {
            id: user.id,
            'Content-Type': 'application/json',
          },
        }
      );

      setIsLoading(false);
      toast.show({
        title: 'Local cadastrado com sucesso!',
        placement: 'top',
        bgColor: 'green.500',
      });
      navigation.navigate('locations');
    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError ? error.message : 'Erro ao realizar cadastro';
      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500',
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleFetchLocationDetails = useCallback(async () => {
    try {
      setIsLoading(true);
      setMessage('Carregando informacoes do local');
      const response = await api.get(`/locations/${locationId}`, {
        headers: {
          id: user.id,
        },
      });

      setLocation({
        ...location,
        cnpj: response.data.cnpj,
        business_name: response.data.business_name,
        business_phone: response.data.business_phone,
        business_email: response.data.business_email,
        address_line: response.data.address_line,
        number: String(response.data.number),
        district: response.data.district,
        city: response.data.city,
        state: response.data.state,
        zipcode: response.data.zipcode,
        latitude: response.data.latitude,
        longitude: response.data.longitude,
        business_description: response.data.business_description,
      });

      setZipCode(response.data.zipcode);
      setPaymentMethods(response.data.payment_methods);
      setBusinessCategories(response.data.business_categories);

      setOpenHour(response.data.open_hours.split('-')[0].trim());
      setCloseHour(response.data.open_hours.split('-')[1].trim());
      setOpenHoursWeekend(response.data.open_hours_weekend);
    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError
        ? error.message
        : 'Erro ao carregar detalhes do local, verifique sua conexão com a internet';
      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500',
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  console.log(location);

  useFocusEffect(
    useCallback(() => {
      handleFetchLocationDetails();
    }, [locationId])
  );

  return (
    <VStack flex={1}>
      <VStack>
        <AppHeader title="Editar Local" />
      </VStack>

      {setIsLoading && (
        <LoadingModal
          showModal={isLoading}
          setShowModal={setIsLoading}
          message={message}
        />
      )}

      <VStack>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          <VStack py={10} px={19}>
            <VStack p={5} mb={5} borderRadius={10} backgroundColor="white">
              <Text fontSize="md" fontFamily="heading" bold mb={3}>
                Informacoes pessoais
              </Text>
              <Input
                placeholder="CNPJ ou CPF"
                value={location.cnpj}
                keyboardType="numeric"
                onChangeText={(value) =>
                  setLocation({ ...location, cnpj: value })
                }
              />
              <Input
                placeholder="Nome Fantasia"
                value={location.business_name}
                onChangeText={(value) =>
                  setLocation({ ...location, business_name: value })
                }
              />
              <Input
                placeholder="Telefone"
                value={location.business_phone}
                onChangeText={(value) =>
                  setLocation({ ...location, business_phone: value })
                }
                keyboardType="numeric"
              />
              <Input
                placeholder="Email"
                value={location.business_email}
                onChangeText={(value) =>
                  setLocation({ ...location, business_email: value })
                }
              />
            </VStack>

            <VStack mb={5} p={5} backgroundColor="white" borderRadius={10}>
              <Text fontSize="md" fontFamily={'heading'} bold mb={3}>
                Localizaçao
              </Text>

              <VStack>
                <HStack>
                  <VStack mr={2}>
                    <Input
                      w={200}
                      placeholder="CEP"
                      value={zipcode}
                      onChangeText={setZipCode}
                      keyboardType="numeric"
                    />
                  </VStack>
                  <VStack>
                    <Button
                      title="Procurar"
                      w={120}
                      onPress={() => handleCepInput(zipcode)}
                      isLoading={isLoading}
                    />
                  </VStack>
                </HStack>
              </VStack>

              <Input
                placeholder="Endereço"
                value={location.address_line}
                editable={false}
                isDisabled={true}
                caretHidden={true}
                showSoftInputOnFocus={false}
              />
              <Input
                placeholder="Número"
                onChangeText={(value) =>
                  setLocation({ ...location, number: value })
                }
                value={location.number}
                keyboardType="numeric"
              />
              <Input
                placeholder="Bairro"
                value={location.district}
                editable={false}
                isDisabled={true}
                caretHidden={true}
                showSoftInputOnFocus={false}
              />
              <Input
                placeholder="Cidade"
                value={location.city}
                editable={false}
                isDisabled={true}
                caretHidden={true}
                showSoftInputOnFocus={false}
              />
              <Input
                placeholder="Estado"
                value={location.state}
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
                {payment_types.map((item) => (
                  <ButtonSelection
                    key={item.id}
                    data={item.name}
                    isToggled={payment_methods?.includes(item.id)}
                    handleOpenDays={() =>
                      handleMultipleSelection(
                        setPaymentMethods,
                        payment_methods,
                        item.id
                      )
                    }
                  />
                ))}
              </HStack>
            </VStack>

            <VStack backgroundColor="white" p={5} borderRadius={10} mb={5}>
              <Text fontSize="md" mb={3} bold>
                Tipos de serviços oferecidos
              </Text>
              <HStack flexWrap={'wrap'}>
                {services_types.map((item) => (
                  <ButtonSelection
                    key={item.id}
                    data={item.name}
                    isToggled={business_categories?.includes(item.id)}
                    handleOpenDays={() =>
                      handleMultipleSelection(
                        setBusinessCategories,
                        business_categories,
                        item.id
                      )
                    }
                  />
                ))}
              </HStack>
            </VStack>

            <VStack backgroundColor="white" p={5} borderRadius={10} mb={5}>
              <Text fontSize="md" bold pb={5}>
                Dias de funcionamento
              </Text>
              <HStack flexWrap={'wrap'}>
                <ButtonSelection
                  data={'segunda'}
                  isToggled={openHoursWeekend?.includes('segunda')}
                  handleOpenDays={() =>
                    handleMultipleSelection(
                      setOpenHoursWeekend,
                      openHoursWeekend,
                      'segunda'
                    )
                  }
                />

                <ButtonSelection
                  data={'terca'}
                  isToggled={openHoursWeekend?.includes('terca')}
                  handleOpenDays={() =>
                    handleMultipleSelection(
                      setOpenHoursWeekend,
                      openHoursWeekend,
                      'terca'
                    )
                  }
                />
                <ButtonSelection
                  data={'quarta'}
                  isToggled={openHoursWeekend?.includes('quarta')}
                  handleOpenDays={() =>
                    handleMultipleSelection(
                      setOpenHoursWeekend,
                      openHoursWeekend,
                      'quarta'
                    )
                  }
                />
                <ButtonSelection
                  data={'quinta'}
                  isToggled={openHoursWeekend?.includes('quinta')}
                  handleOpenDays={() =>
                    handleMultipleSelection(
                      setOpenHoursWeekend,
                      openHoursWeekend,
                      'quinta'
                    )
                  }
                />
                <ButtonSelection
                  data={'sexta'}
                  isToggled={openHoursWeekend?.includes('sexta')}
                  handleOpenDays={() =>
                    handleMultipleSelection(
                      setOpenHoursWeekend,
                      openHoursWeekend,
                      'sexta'
                    )
                  }
                />
                <ButtonSelection
                  data={'sabado'}
                  isToggled={openHoursWeekend?.includes('sabado')}
                  handleOpenDays={() =>
                    handleMultipleSelection(
                      setOpenHoursWeekend,
                      openHoursWeekend,
                      'sabado'
                    )
                  }
                />
                <ButtonSelection
                  data={'domingo'}
                  isToggled={openHoursWeekend?.includes('domingo')}
                  handleOpenDays={() =>
                    handleMultipleSelection(
                      setOpenHoursWeekend,
                      openHoursWeekend,
                      'domingo'
                    )
                  }
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
                    value={openHour}
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
                    value={closeHour}
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
                onChangeText={(value) =>
                  setLocation({ ...location, business_description: value })
                }
                fontSize="md"
                borderRadius={5}
              />
            </VStack>

            <Button
              title="Criar local"
              onPress={handleSubmitBusiness}
              isLoading={isLoading}
            />
          </VStack>
        </ScrollView>
      </VStack>
    </VStack>
  );
}
