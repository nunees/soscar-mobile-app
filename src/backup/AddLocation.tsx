import { AppHeader } from '@components/AppHeader';
import { Button } from '@components/Button';
import ButtonSelection from '@components/RegisterLocationButtonSelect';
import { Input } from '@components/Input';
import { LoadingModal } from '@components/LoadingModal';
import { TextArea } from '@components/TextArea';
import { ILocation } from '@dtos/ILocation';
import { useAuth } from '@hooks/useAuth';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { PartnerNavigatorRoutesProps } from '@routes/partner.routes';
import { api } from '@services/api';
import { AppError } from '@utils/AppError';
import { ConvertAddressToLatLong } from '@utils/CalculatePositionDistance';
import { GetAddressByCEP } from '@utils/GetAddressByCEP';
import { ScrollView, VStack, Text, useToast, HStack } from 'native-base';
import { useCallback, useState } from 'react';
import { set } from 'react-hook-form';

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

export function AddLocation() {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string>('');

  const [location, setLocation] = useState<ILocation>({} as ILocation);

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

  const toast = useToast();
  const { user } = useAuth();

  const navigation = useNavigation<PartnerNavigatorRoutesProps>();

  async function handleCepInput(cep: string) {
    try {
      setIsLoading(true);
      setMessage('Buscando endereço...');
      if (zipcode.length === 8) {
        const address = await GetAddressByCEP(cep);
        if (address.data.erro || !address.data.logradouro) {
          return null;
        }

        const location = await ConvertAddressToLatLong(
          `${address.data.logradouro}, ${address.data.bairro}, ${address.data.localidade}, ${address.data.uf}`
        );

        if (location) {
          setLatitude(String(location.latitude));
          setLongitude(String(location.longitude));
        }

        if (address) {
          setAddressLine(address.data.logradouro);
          setDistrict(address.data.bairro);
          setCity(address.data.localidade);
          setState(address.data.uf);
          setCorrectZipCode(false);
        } else {
          setCorrectZipCode(true);
        }
      }
    } catch (error) {
      setCorrectZipCode(true);
    } finally {
      setIsLoading(false);
    }
    return true;
  }

  function handleHour(date: Date | undefined, state: string) {
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
  }

  const handleSubmitBusiness = useCallback(async () => {
    try {
      setMessage('Salvando local...');
      setIsLoading(true);

      await api.post(
        '/locations',
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

  return (
    <VStack flex={1}>
      <VStack>
        <AppHeader title="Adicionar Local" />
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
                keyboardType="numeric"
              />
              <Input
                placeholder="Email"
                value={business_email}
                onChangeText={setBusinessEmail}
              />
            </VStack>

            <VStack mb={5} p={5} backgroundColor="white" borderRadius={10}>
              <Text fontSize="md" fontFamily={'heading'} bold mb={3}>
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
                value={number}
                keyboardType="numeric"
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
