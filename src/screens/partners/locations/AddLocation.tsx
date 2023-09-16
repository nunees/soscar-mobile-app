import { AppHeader } from '@components/AppHeader';
import { Button } from '@components/Button';
import { Input } from '@components/Input';
import { LoadingModal } from '@components/LoadingModal';
import { TextArea } from '@components/TextArea';
import { Feather } from '@expo/vector-icons';
import { useAuth } from '@hooks/useAuth';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import { PartnerNavigatorRoutesProps } from '@routes/partner.routes';
import { api } from '@services/api';
import { AppError } from '@utils/AppError';
import { ConvertAddressToLatLong } from '@utils/CalculatePositionDistance';
import { GetAddressByCEP } from '@utils/GetAddressByCEP';
import {
  ScrollView,
  VStack,
  Text,
  Checkbox,
  useToast,
  HStack,
  Icon,
} from 'native-base';
import { useState } from 'react';

export function AddLocation() {
  const [paymentMethods] = useState([
    { id: 1, name: 'Dinheiro' },
    { id: 2, name: 'Crédito' },
    { id: 3, name: 'Débito' },
    { id: 4, name: 'PIX' },
    { id: 5, name: 'Transferencia' },
    { id: 6, name: 'Outros' },
  ]);

  const [services] = useState([
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
  ]);

  const [cnpj, setCnpj] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [businessPhone, setBusinessPhone] = useState('');
  const [businessEmail, setBusinessEmail] = useState('');
  const [addressLine, setAddressLine] = useState('');
  const [number, setNumber] = useState('');
  const [city, setCity] = useState('');
  const [district, setDistrict] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [openDays, setOpenDays] = useState<string[]>([]);
  const [openHour, setOpenHour] = useState('');
  const [closeHour, setCloseHour] = useState('');
  const [selectedPaymentMethods, setSelectedPaymentMethods] = useState<
    number[]
  >([]);
  const [selectedBusinessServices, setSelectedBusinessServices] = useState<
    number[]
  >([]);
  const [businessDescription, setBusinessDescription] = useState('');

  const [correctZipCode, setCorrectZipCode] = useState(false);
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);

  const { user } = useAuth();
  const toast = useToast();
  const navigation = useNavigation<PartnerNavigatorRoutesProps>();

  function setPaymentMethodsHandler(value: number) {
    setSelectedPaymentMethods((prevState) => {
      const alreadySelected = prevState.includes(value);
      if (!alreadySelected) {
        return [...prevState, value];
      }
      return prevState.filter((item) => item !== value);
    });
  }

  function setServicesHandler(value: number) {
    setSelectedBusinessServices((prevState) => {
      const alreadySelected = prevState.includes(value);
      if (!alreadySelected) {
        return [...prevState, value];
      }
      return prevState.filter((item) => item !== value);
    });
  }

  async function handleCEP(value: string) {
    try {
      setZipCode('');
      setIsUploading(true);
      if (value.length === 8) {
        setCorrectZipCode(false);
        const address = await GetAddressByCEP(value);
        setAddressLine(address.data.logradouro);
        setDistrict(address.data.bairro);
        setCity(address.data.localidade);
        setState(address.data.uf);
        const location = await ConvertAddressToLatLong(
          `${address.data.logradouro}, ${address.data.bairro} - ${address.data.uf}`
        );
        setLatitude(location!.latitude);
        setLongitude(location!.longitude);
      } else {
        setCorrectZipCode(true);
      }
      setZipCode(value);
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
  }

  function handleOpenDays(value: string) {
    setOpenDays((prevState) => {
      const alreadySelected = prevState.includes(value);
      if (!alreadySelected) {
        return [...prevState, value];
      }
      return prevState.filter((item) => item !== value);
    });
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

  function resetFields() {
    setCnpj('');
    setBusinessName('');
    setBusinessPhone('');
    setBusinessEmail('');
    setAddressLine('');
    setNumber('');
    setCity('');
    setDistrict('');
    setState('');
    setZipCode('');
    setOpenDays([]);
    setOpenHour('');
    setCloseHour('');
    setBusinessDescription('');
  }

  async function handleSubmitBusiness() {
    try {
      setIsUploading(true);

      const response = await api.post(
        '/locations',
        {
          cnpj,
          business_name: businessName,
          business_phone: businessPhone,
          business_email: businessEmail,
          address_line: addressLine,
          number: Number(number),
          city,
          district,
          state,
          zipcode: zipCode,
          payment_methods: selectedPaymentMethods,
          business_categories: selectedBusinessServices,
          business_description: businessDescription,
          open_hours: `${openHour}-${closeHour}`,
          open_hours_weekend: openDays,
          latitude: String(latitude),
          longitude: String(longitude),
        },
        {
          headers: {
            id: user.id,
          },
        }
      );
      resetFields();
      setIsUploading(false);
      toast.show({
        title: response.data.message,
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
  }

  return (
    <VStack flex={1}>
      <VStack>
        <AppHeader title="Adicionar Local" />
      </VStack>

      {isUploading && (
        <LoadingModal
          showModal={isUploading}
          setShowModal={setIsUploading}
          message="Aguarde..."
        />
      )}

      <VStack>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          <VStack py={10} px={19}>
            <VStack p={5} mb={5} borderRadius={10} backgroundColor="white">
              <Text fontSize="md" bold mb={3}>
                Informacoes pessoais
              </Text>
              <Input
                placeholder="CNPJ ou CPF"
                value={cnpj}
                onChangeText={setCnpj}
                InputRightElement={
                  <Icon
                    as={Feather}
                    name={!cnpj ? 'x' : 'check'}
                    size={4}
                    mr={2}
                    color={!cnpj ? 'red.500' : 'green.500'}
                  />
                }
              />
              <Input
                placeholder="Nome Fantasia"
                value={businessName}
                onChangeText={setBusinessName}
                InputRightElement={
                  <Icon
                    as={Feather}
                    name={!businessName ? 'x' : 'check'}
                    size={4}
                    mr={2}
                    color={!businessName ? 'red.500' : 'green.500'}
                  />
                }
              />
              <Input
                placeholder="Telefone"
                value={businessPhone}
                onChangeText={setBusinessPhone}
                InputRightElement={
                  <Icon
                    as={Feather}
                    name={!businessPhone ? 'x' : 'check'}
                    size={4}
                    mr={2}
                    color={!businessPhone ? 'red.500' : 'green.500'}
                  />
                }
              />
              <Input
                placeholder="Email"
                value={businessEmail}
                onChangeText={setBusinessEmail}
                InputRightElement={
                  <Icon
                    as={Feather}
                    name={!businessEmail ? 'x' : 'check'}
                    size={4}
                    mr={2}
                    color={!businessEmail ? 'red.500' : 'green.500'}
                  />
                }
              />
            </VStack>

            <VStack mb={5} p={5} backgroundColor="white" borderRadius={10}>
              <Text fontSize="md" bold mb={3}>
                Localizaçao
              </Text>

              <Input
                w={200}
                placeholder="CEP"
                value={zipCode}
                onChangeText={(value) => handleCEP(value)}
                InputRightElement={
                  <Icon
                    as={Feather}
                    name={correctZipCode ? 'x' : 'check'}
                    size={4}
                    mr={2}
                    color={correctZipCode ? 'red.500' : 'green.500'}
                  />
                }
              />

              <Input
                placeholder="Endereço"
                value={addressLine}
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
                InputRightElement={
                  <Icon
                    as={Feather}
                    name={!number ? 'x' : 'check'}
                    size={4}
                    mr={2}
                    color={!number ? 'red.500' : 'green.500'}
                  />
                }
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
              <VStack>
                {paymentMethods.map((item) => (
                  <Checkbox.Group>
                    <Checkbox
                      value={item.id.toString()}
                      colorScheme="orange"
                      mb={5}
                      onChange={() => setPaymentMethodsHandler(item.id)}
                      key={item.id}
                    >
                      <Text fontSize="md">{item.name}</Text>
                    </Checkbox>
                  </Checkbox.Group>
                ))}
              </VStack>
            </VStack>

            <VStack backgroundColor="white" p={5} borderRadius={10} mb={5}>
              <Text fontSize="md" mb={3} bold>
                Tipos de serviços oferecidos
              </Text>
              <VStack flexGrow={1}>
                <Checkbox.Group>
                  {services.map((item) => (
                    <Checkbox
                      value={item.id.toString()}
                      colorScheme="orange"
                      key={item.id}
                      mb={5}
                      onChange={() => setServicesHandler(item.id)}
                    >
                      <Text fontSize="md">{item.name}</Text>
                    </Checkbox>
                  ))}
                </Checkbox.Group>
              </VStack>
            </VStack>

            <VStack backgroundColor="white" p={5} borderRadius={10} mb={5}>
              <Text fontSize="md" bold pb={5}>
                Aberto nos dias
              </Text>
              <VStack flexGrow={1}>
                <Checkbox.Group>
                  <Checkbox
                    value="segunda"
                    colorScheme="orange"
                    mb={5}
                    onChange={() => handleOpenDays('segunda')}
                  >
                    <Text fontSize="md">Segunda</Text>
                  </Checkbox>
                  <Checkbox
                    value="terca"
                    colorScheme="orange"
                    mb={5}
                    onChange={() => handleOpenDays('terça')}
                  >
                    <Text fontSize="md">Terça</Text>
                  </Checkbox>
                  <Checkbox
                    value="quarta"
                    colorScheme="orange"
                    mb={5}
                    onChange={() => handleOpenDays('quarta')}
                  >
                    <Text fontSize="md">Quarta</Text>
                  </Checkbox>
                  <Checkbox
                    value="quinta"
                    colorScheme="orange"
                    mb={5}
                    onChange={() => handleOpenDays('quinta')}
                  >
                    <Text fontSize="md">Quinta</Text>
                  </Checkbox>
                  <Checkbox
                    value="sexta"
                    colorScheme="orange"
                    mb={5}
                    onChange={() => handleOpenDays('sexta')}
                  >
                    <Text fontSize="md">Sexta</Text>
                  </Checkbox>
                  <Checkbox
                    value="sabado"
                    colorScheme="orange"
                    mb={5}
                    onChange={() => handleOpenDays('sabado')}
                  >
                    <Text fontSize="md">Sábado</Text>
                  </Checkbox>
                  <Checkbox
                    value="domingo"
                    colorScheme="orange"
                    mb={5}
                    onChange={() => handleOpenDays('domingo')}
                  >
                    <Text fontSize="md">Domingo</Text>
                  </Checkbox>
                </Checkbox.Group>
              </VStack>
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
                value={businessDescription}
                onChangeText={setBusinessDescription}
                fontSize="sm"
                borderRadius={5}
              />
            </VStack>

            <Button title="Criar local" onPress={handleSubmitBusiness} />
          </VStack>
        </ScrollView>
      </VStack>
    </VStack>
  );
}
