import NewLocationSVG from '@assets/newlocation.svg';
import { AppHeader } from '@components/AppHeader';
import { Button } from '@components/Button';
import { Input } from '@components/Input';
import { LoadingModal } from '@components/LoadingModal';
import RegisterLocationButtonSelect from '@components/RegisterLocationButtonSelect';
import { TextArea } from '@components/TextArea';
import { PAYMENT_TYPES } from '@data/PaymentTypes';
import { SERVICES_TYPES } from '@data/ServicesTypes';
import { WEEK_DAYS } from '@data/WeekDays';
import { yupResolver } from '@hookform/resolvers/yup';
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
import {
  VStack,
  Text,
  useToast,
  ScrollView,
  HStack,
  Switch,
} from 'native-base';
import { useState, useCallback } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as yup from 'yup';

type RouteParamProps = {
  locationId: string;
};

type FormDataProps = {
  cnpj: string;
  business_name: string;
  business_phone: string;
  business_email: string;
  address_line: string;
  number: string;
  district: string;
  city: string;
  state: string;
  zipcode: string;
  business_description: string;
  latitude: string;
  longitude: string;
  openAt: string;
  closeAt: string;
};

const addLocationSchema = yup.object().shape({
  cnpj: yup.string().required('Informe um CPF ou CNPJ'),
  business_name: yup.string().required('Informe um nome fantasia'),
  business_phone: yup.string().required('Informe um telefone'),
  business_email: yup.string().required('Informe um email'),
  address_line: yup.string().required('Informe um endereço'),
  number: yup.string().required('Informe um número'),
  district: yup.string().required('Informe um bairro'),
  city: yup.string().required('Informe uma cidade'),
  state: yup.string().required('Informe um estado'),
  zipcode: yup.string().required('Informe um CEP'),
  business_description: yup.string().required('Informe uma descrição'),
  latitude: yup.string().required('Localização não encontrada'),
  longitude: yup.string().required('Localização não encontrada'),
  openAt: yup.string().required('Informe um horário de abertura'),
  closeAt: yup.string().required('Informe um horário de fechamento'),
});

export function EditLocation() {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);

  const [isPlaceActive, setIsPlaceActive] = useState(true);

  const [payment_methods, setPaymentMethods] = useState<number[]>([]);
  const [openHoursWeekend, setOpenHoursWeekend] = useState<string[]>([]);
  const [business_categories, setBusinessCategories] = useState<number[]>([]);

  const { user } = useAuth();
  const toast = useToast();
  const navigation = useNavigation<PartnerNavigatorRoutesProps>();

  const routes = useRoute();
  const { locationId } = routes.params as RouteParamProps;

  const {
    control,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors },
  } = useForm<FormDataProps>({
    resolver: yupResolver(addLocationSchema),
  });

  const handleHour = useCallback((date: Date | undefined, state: string) => {
    if (date) {
      const tempDate = date
        .toLocaleTimeString()
        .split(':')
        .slice(0, 2)
        .join(':');

      if (state === 'open') {
        setValue('openAt', tempDate);
      } else if (state === 'close') {
        setValue('closeAt', tempDate);
      }
    }
  }, []);

  const handleCepInput = useCallback(async () => {
    try {
      setIsLoading(true);
      const fields = getValues();

      if (fields.zipcode.length === 8) {
        const address = await GetAddressByCEP(fields.zipcode);

        if (address.data.erro || !address.data.logradouro) {
          throw new AppError('CEP não encontrado');
        }

        const position = await ConvertAddressToLatLong(
          `${address.data.logradouro}, ${address.data.bairro} - ${address.data.uf}`
        );

        if (position) {
          setValue('address_line', address.data.logradouro);
          setValue('district', address.data.bairro);
          setValue('city', address.data.localidade);
          setValue('state', address.data.uf);
          setValue('zipcode', address.data.cep);
          setValue('latitude', String(position.latitude));
          setValue('longitude', String(position.longitude));
        }
      }
    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError ? error.message : 'Erro ao buscar endereço';
      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500',
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  async function handleSetInative(status: boolean) {
    try {
      await api.patch(
        `/locations/${locationId}`,
        {
          active: status,
        },
        {
          headers: {
            id: user.id,
          },
        }
      );
      setIsPlaceActive(status);
    } catch (error) {
      throw new AppError('Erro ao inativar local');
    }
  }

  async function handleSubmitBusiness() {
    try {
      setIsLoading(true);

      const {
        cnpj,
        business_name,
        business_phone,
        business_email,
        address_line,
        number,
        district,
        city,
        state,
        zipcode,
        latitude,
        longitude,
        business_description,
        openAt,
        closeAt,
      } = getValues();

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
          open_hours: `${openAt} - ${closeAt}`,
          open_hours_weekend: openHoursWeekend,
          business_description,
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
  }

  const handleFetchLocationDetails = useCallback(async () => {
    try {
      setIsLoadingData(true);

      const response = await api.get(`/locations/${locationId}`, {
        headers: {
          id: user.id,
        },
      });

      setValue('zipcode', response.data.zipcode);
      setValue('cnpj', response.data.cnpj);
      setValue('business_name', response.data.business_name);
      setValue('business_phone', response.data.business_phone);
      setValue('business_email', response.data.business_email);
      setValue('address_line', response.data.address_line);
      setValue('number', String(response.data.number));
      setValue('district', response.data.district);
      setValue('city', response.data.city);
      setValue('state', response.data.state);
      setValue('zipcode', response.data.zipcode);
      setValue('latitude', response.data.latitude);
      setValue('longitude', response.data.longitude);
      setValue('business_description', response.data.business_description);
      setValue('openAt', response.data.open_hours.split('-')[0].trim());
      setValue('closeAt', response.data.open_hours.split('-')[1].trim());
      setIsPlaceActive(response.data.active);

      setPaymentMethods(response.data.payment_methods);
      setBusinessCategories(response.data.business_categories);
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
      setIsLoadingData(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      handleFetchLocationDetails();
    }, [locationId])
  );

  return (
    <SafeAreaView>
      <VStack>
        <AppHeader
          title="Editar Local"
          navigation={navigation}
          screen="locations"
        />
      </VStack>

      {isLoadingData && (
        <LoadingModal
          showModal={isLoading}
          setShowModal={setIsLoading}
          message="Buscando dados"
        />
      )}

      <VStack>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 150 }}
        >
          <VStack>
            <NewLocationSVG width={400} height={200} />
          </VStack>

          <VStack px={5}>
            <HStack justifyContent={'space-between'} alignItems={'center'}>
              <Text bold>Ativo?</Text>
              <Switch
                ml={2}
                onTrackColor="purple.500"
                size={'sm'}
                onChange={() => handleSetInative(!isPlaceActive)}
                isChecked={isPlaceActive}
              />
            </HStack>
          </VStack>

          <VStack px={5}>
            <Text fontSize="md" fontFamily="heading" bold mb={3}>
              Informações pessoais
            </Text>
            <VStack p={5} mb={5} borderRadius={10} backgroundColor="white">
              <Controller
                control={control}
                name="cnpj"
                rules={{ required: 'Informe um numero de CPF ou CNPJ' }}
                render={({ field: { onChange, value } }) => (
                  <Input
                    placeholder="CNPJ ou CPF"
                    fontSize={'md'}
                    keyboardType="numeric"
                    onChangeText={onChange}
                    value={value}
                    errorMessage={errors.cnpj?.message}
                  />
                )}
              />

              <Controller
                control={control}
                name="business_name"
                rules={{ required: 'Informe o nome do local' }}
                render={({ field: { onChange, value } }) => (
                  <Input
                    placeholder="Nome Fantasia"
                    fontSize={'md'}
                    keyboardType="default"
                    onChangeText={onChange}
                    value={value}
                    errorMessage={errors.cnpj?.message}
                  />
                )}
              />

              <Controller
                control={control}
                name="business_phone"
                rules={{ required: 'Informe o numero de telefone' }}
                render={({ field: { onChange, value } }) => (
                  <Input
                    placeholder="Telefone"
                    fontSize={'md'}
                    keyboardType="numeric"
                    onChangeText={onChange}
                    value={value}
                    errorMessage={errors.cnpj?.message}
                  />
                )}
              />

              <Controller
                control={control}
                name="business_email"
                rules={{ required: 'Informe o endereço de email valido' }}
                render={({ field: { onChange, value } }) => (
                  <Input
                    placeholder="Email"
                    fontSize={'md'}
                    keyboardType="numeric"
                    onChangeText={onChange}
                    value={value}
                    errorMessage={errors.cnpj?.message}
                  />
                )}
              />
            </VStack>
          </VStack>

          <VStack px={5}>
            <Text fontSize="md" fontFamily={'heading'} bold mb={3}>
              Localização
            </Text>
            <VStack mb={5} p={5} backgroundColor="white" borderRadius={10}>
              <VStack>
                <HStack>
                  <VStack mr={2}>
                    <Controller
                      control={control}
                      name="zipcode"
                      rules={{ required: 'Informe um cep valido' }}
                      render={({ field: { onChange, value } }) => (
                        <Input
                          w={200}
                          placeholder="CEP"
                          fontSize={'md'}
                          keyboardType="numeric"
                          onChangeText={onChange}
                          value={value}
                          errorMessage={errors.cnpj?.message}
                        />
                      )}
                    />
                  </VStack>
                  <VStack>
                    <Button
                      title="Procurar"
                      w={100}
                      onPress={() => handleCepInput()}
                      isLoading={isLoading}
                    />
                  </VStack>
                </HStack>
              </VStack>

              <Controller
                control={control}
                name="address_line"
                rules={{ required: 'Informe um endereço valido' }}
                render={({ field: { onChange, value } }) => (
                  <Input
                    placeholder="Endereço"
                    fontSize={'md'}
                    editable={false}
                    isDisabled={true}
                    caretHidden={true}
                    showSoftInputOnFocus={false}
                    onChangeText={onChange}
                    value={value}
                    errorMessage={errors.cnpj?.message}
                  />
                )}
              />

              <Controller
                control={control}
                name="number"
                rules={{ required: 'Informe um numero' }}
                render={({ field: { onChange, value } }) => (
                  <Input
                    placeholder="Numero"
                    fontSize={'md'}
                    keyboardType="numeric"
                    onChangeText={onChange}
                    value={value}
                    errorMessage={errors.cnpj?.message}
                  />
                )}
              />

              <Controller
                control={control}
                name="district"
                rules={{ required: 'Informe um bairro' }}
                render={({ field: { onChange, value } }) => (
                  <Input
                    placeholder="Endereço"
                    fontSize={'md'}
                    editable={false}
                    isDisabled={true}
                    caretHidden={true}
                    showSoftInputOnFocus={false}
                    onChangeText={onChange}
                    value={value}
                    errorMessage={errors.cnpj?.message}
                  />
                )}
              />

              <Controller
                control={control}
                name="city"
                rules={{ required: 'Informe uma cidade' }}
                render={({ field: { onChange, value } }) => (
                  <Input
                    placeholder="Cidade"
                    fontSize={'md'}
                    editable={false}
                    isDisabled={true}
                    caretHidden={true}
                    showSoftInputOnFocus={false}
                    onChangeText={onChange}
                    value={value}
                    errorMessage={errors.cnpj?.message}
                  />
                )}
              />

              <Controller
                control={control}
                name="state"
                rules={{ required: 'Informe um estado' }}
                render={({ field: { onChange, value } }) => (
                  <Input
                    placeholder="Estado"
                    fontSize={'md'}
                    editable={false}
                    isDisabled={true}
                    caretHidden={true}
                    showSoftInputOnFocus={false}
                    onChangeText={onChange}
                    value={value}
                    errorMessage={errors.cnpj?.message}
                  />
                )}
              />

              <Text pb={1} color="gray.400">
                Coordenadas
              </Text>
              <Controller
                control={control}
                name="latitude"
                rules={{ required: 'Informe uma latitude' }}
                render={({ field: { onChange, value } }) => (
                  <Input
                    placeholder="Latitude"
                    fontSize={'md'}
                    editable={false}
                    isDisabled={true}
                    caretHidden={true}
                    showSoftInputOnFocus={false}
                    onChangeText={onChange}
                    value={value}
                    errorMessage={errors.cnpj?.message}
                  />
                )}
              />

              <Controller
                control={control}
                name="longitude"
                rules={{ required: 'Informe uma longitude' }}
                render={({ field: { onChange, value } }) => (
                  <Input
                    placeholder="Longitude"
                    fontSize={'md'}
                    editable={false}
                    isDisabled={true}
                    caretHidden={true}
                    showSoftInputOnFocus={false}
                    onChangeText={onChange}
                    value={value}
                    errorMessage={errors.cnpj?.message}
                  />
                )}
              />
            </VStack>
          </VStack>

          <VStack px={5}>
            <Text fontSize="md" mb={3} bold>
              Meios de pagamentos oferecidos
            </Text>
            <VStack backgroundColor="white" p={5} borderRadius={10} mb={5}>
              <HStack flexWrap={'wrap'}>
                <RegisterLocationButtonSelect
                  items={PAYMENT_TYPES}
                  state={payment_methods}
                  setState={setPaymentMethods}
                />
              </HStack>
            </VStack>
          </VStack>

          <VStack px={5}>
            <Text fontSize="md" mb={3} bold>
              Tipos de serviços oferecidos
            </Text>
            <VStack backgroundColor="white" p={5} borderRadius={10} mb={5}>
              <HStack flexWrap={'wrap'}>
                <RegisterLocationButtonSelect
                  items={SERVICES_TYPES}
                  state={business_categories}
                  setState={setBusinessCategories}
                />
              </HStack>
            </VStack>
          </VStack>

          <VStack p={5}>
            <Text fontSize="md" bold pb={5}>
              Dias de funcionamento
            </Text>
            <VStack backgroundColor="white" p={5} borderRadius={10} mb={5}>
              <HStack flexWrap={'wrap'}>
                <RegisterLocationButtonSelect
                  items={WEEK_DAYS}
                  state={openHoursWeekend}
                  setState={setOpenHoursWeekend}
                  saveText={true}
                />
              </HStack>
            </VStack>
          </VStack>

          <VStack p={5}>
            <Text fontSize="md" bold pb={5}>
              Horário de funcionamento
            </Text>
            <VStack backgroundColor="white" p={5} borderRadius={10} mb={5}>
              <HStack justifyContent={'space-around'}>
                <VStack>
                  <Controller
                    control={control}
                    name="openAt"
                    rules={{ required: 'Informe um horário de abertura' }}
                    render={({ field: { value } }) => (
                      <Input
                        w={120}
                        placeholder="Abre as"
                        fontSize={'md'}
                        editable={false}
                        isDisabled={false}
                        caretHidden={false}
                        showSoftInputOnFocus={false}
                        value={value}
                        errorMessage={errors.cnpj?.message}
                      />
                    )}
                  />
                </VStack>

                <VStack>
                  <Controller
                    control={control}
                    name="closeAt"
                    rules={{ required: 'Informe um horário de fechamento' }}
                    render={({ field: { value } }) => (
                      <Input
                        w={120}
                        placeholder="Fecha as"
                        fontSize={'md'}
                        editable={false}
                        isDisabled={true}
                        caretHidden={true}
                        showSoftInputOnFocus={false}
                        value={value}
                        errorMessage={errors.cnpj?.message}
                      />
                    )}
                  />
                </VStack>
              </HStack>

              <VStack>
                <Button
                  title="Selecionar horário de abertura"
                  bgColor={'purple.500'}
                  mb={2}
                  onPress={() =>
                    DateTimePickerAndroid.open({
                      mode: 'time',
                      is24Hour: true,
                      value: new Date(),
                      onChange: (event, date) =>
                        handleHour(date as Date, 'open'),
                    })
                  }
                />

                <Button
                  title="Selecionar horário de fechamento"
                  bgColor={'purple.500'}
                  mb={2}
                  onPress={() => {
                    DateTimePickerAndroid.open({
                      mode: 'time',
                      is24Hour: true,
                      value: new Date(),
                      onChange: (event, date) =>
                        handleHour(date as Date, 'close'),
                    });
                  }}
                />
              </VStack>
            </VStack>
          </VStack>

          <VStack px={5}>
            <Text fontSize={'md'} bold pb={5}>
              Conte nos um pouco sobre o seu negócio
            </Text>
            <VStack backgroundColor="white" p={5} borderRadius={10} mb={5}>
              <Controller
                control={control}
                name="business_description"
                rules={{ required: 'Informe uma descrição de seu local' }}
                render={({ field: { onChange, value } }) => (
                  <TextArea
                    h={150}
                    fontSize="md"
                    borderRadius={5}
                    onChangeText={onChange}
                    value={value}
                    errorMessage={errors.cnpj?.message}
                  />
                )}
              />
            </VStack>
          </VStack>

          <VStack px={5}>
            <Button
              title="Atualizar local"
              onPress={handleSubmit(handleSubmitBusiness)}
              isLoading={isLoading}
            />
          </VStack>
        </ScrollView>
      </VStack>
    </SafeAreaView>
  );
}
