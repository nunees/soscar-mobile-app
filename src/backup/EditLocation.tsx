import { AppHeader } from '@components/AppHeader';
import { Button } from '@components/Button';
import ButtonSelection from '@components/RegisterLocationButtonSelect';
import { Input } from '@components/Input';
import { LoadingModal } from '@components/LoadingModal';
import { TextArea } from '@components/TextArea';
import { useAuth } from '@hooks/useAuth';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { useNavigation, useRoute } from '@react-navigation/native';
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
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState('');

  const [cnpj, setCnpj] = useState<string>('');
  const [business_name, setBusinessName] = useState<string>('');
  const [business_phone, setBusinessPhone] = useState<string>('');
  const [business_email, setBusinessEmail] = useState<string>('');
  const [address_line, setAddressLine] = useState<string>('');
  const [number, setNumber] = useState<string>('');
  const [district, setDistrict] = useState<string>('');
  const [city, setCity] = useState<string>('');
  const [state, setState] = useState<string>('');
  const [zipcode, setZipCode] = useState<string>('');

  const [latitude, setLatitude] = useState<string>('');
  const [longitude, setLongitude] = useState<string>('');

  const [payment_methods, setPaymentMethods] = useState<number[]>([]);
  const [openHoursWeekend, setOpenHoursWeekend] = useState<string[]>([]);
  const [business_categories, setBusinessCategories] = useState<number[]>([]);
  const [business_description, setBusinessDescription] = useState<string>('');

  const [openHour, setOpenHour] = useState<string>('');
  const [closeHour, setCloseHour] = useState<string>('');

  const [correctZipCode, setCorrectZipCode] = useState<boolean>(false);

  const routes = useRoute();
  const toast = useToast();
  const { user } = useAuth();

  const { locationId } = routes.params as RouteParamProps;
  const navigation = useNavigation<PartnerNavigatorRoutesProps>();

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

  const handleCEP = useCallback(async (value: string) => {
    if (value.length === 8) {
      try {
        setIsUploading(true);
        setMessage('Procurando endereco');
        setCorrectZipCode(false);
        const address = await GetAddressByCEP(value);
        if (address.data.erro || !address.data.logradouro) {
          throw new AppError('CEP invalido');
        }

        setAddressLine(address.data.logradouro);
        setDistrict(address.data.bairro);
        setCity(address.data.localidade);
        setState(address.data.uf);

        const location = await ConvertAddressToLatLong(
          `${address.data.logradouro}, ${address.data.bairro} - ${address.data.uf}`
        );

        if (!location) {
          throw new AppError('Endereço invalido');
        }

        setLatitude(String(location.latitude));
        setLongitude(String(location.longitude));
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
    }
  }, []);

  const handleSubmitBusiness = useCallback(async () => {
    try {
      setMessage('Salvando');
      setIsUploading(true);

      await api.patch(
        `/locations/${locationId}`,
        {
          cnpj,
          business_name,
          business_phone,
          business_email,
          address_line,
          number: Number(number),
          district,
          city,
          state,
          zipcode,
          latitude,
          longitude,
          payment_methods,
          business_categories,
          open_hours: `${openHour} - ${closeHour}`,
          open_hours_weekend: openHoursWeekend,
          business_description,
        },
        {
          headers: {
            id: user.id,
          },
        }
      );

      setIsUploading(false);
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
      setIsUploading(false);
    }
  }, []);

  const handleFetchLocationDetails = useCallback(async () => {
    try {
      setIsUploading(true);
      setMessage('Carregando detalhes do local');
      const response = await api.get(`/locations/${locationId}`, {
        headers: {
          id: user.id,
        },
      });

      setCnpj(response.data.cnpj);
      setBusinessName(response.data.business_name);
      setBusinessPhone(response.data.business_phone);
      setBusinessEmail(response.data.business_email);
      setAddressLine(response.data.address_line);
      setNumber(String(response.data.number));
      setDistrict(response.data.district);
      setCity(response.data.city);
      setState(response.data.state);
      setZipCode(response.data.zipcode);
      setLatitude(String(response.data.latitude));
      setLongitude(String(response.data.longitude));
      setPaymentMethods(response.data.payment_methods);
      setBusinessCategories(response.data.business_categories);
      setBusinessDescription(response.data.business_description);
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
      setIsUploading(false);
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
                value={cnpj}
                keyboardType="numeric"
                onChangeText={setCnpj}
              />

              <Input
                placeholder="Nome Fantasia"
                value={business_name}
                onChangeText={setBusinessName}
              />
              <Input
                placeholder="Telefone"
                value={business_phone}
                onChangeText={setBusinessPhone}
              />
              <Input
                placeholder="Email"
                value={business_email}
                onChangeText={setBusinessEmail}
              />
            </VStack>

            <VStack mb={5} p={5} backgroundColor="white" borderRadius={10}>
              <Text fontSize="md" bold mb={3}>
                Localizaçao
              </Text>

              <VStack>
                <HStack>
                  <VStack mr={5}>
                    <Input
                      w={200}
                      placeholder="CEP"
                      value={zipcode}
                      onChangeText={setZipCode}
                      keyboardType="numeric"
                      isInvalid={correctZipCode}
                      errorMessage={correctZipCode ? 'CEP invalido' : ''}
                    />
                  </VStack>
                  <VStack>
                    <Button
                      title="Procurar"
                      w={120}
                      onPress={() => handleCEP(zipcode)}
                      isLoading={isUploading}
                    />
                  </VStack>
                </HStack>
              </VStack>

              <Input
                placeholder="Endereço"
                value={address_line}
                onChangeText={setAddressLine}
                editable={false}
                isDisabled={true}
                caretHidden={true}
                showSoftInputOnFocus={false}
              />
              <Input
                placeholder="Número"
                onChangeText={setNumber}
                value={String(number)}
              />
              <Input
                placeholder="Bairro"
                value={district}
                onChangeText={setDistrict}
                editable={false}
                isDisabled={true}
                caretHidden={true}
                showSoftInputOnFocus={false}
              />
              <Input
                placeholder="Cidade"
                value={city}
                onChangeText={setCity}
                editable={false}
                isDisabled={true}
                caretHidden={true}
                showSoftInputOnFocus={false}
              />
              <Input
                placeholder="Estado"
                value={state}
                onChangeText={setState}
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
                value={business_description}
                onChangeText={setBusinessDescription}
                fontSize="md"
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
