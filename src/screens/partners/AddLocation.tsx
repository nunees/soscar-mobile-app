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
      toast.show({
        title: response.data.message,
        placement: 'top',
        bgColor: 'green.500',
      });
      setIsUploading(false);
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
      const tempDate = date.toString().split('T')[0].split(' ')[4].split(':');
      if (state === 'open') {
        setOpenHour(`${tempDate[0]}:${tempDate[1]}`);
      } else if (state === 'close') {
        setCloseHour(`${tempDate[0]}:${tempDate[1]}`);
      } else {
        return null;
      }
    }
    return null;
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
          contentContainerStyle={{ paddingBottom: 120 }}
        >
          <VStack py={10} px={19}>
            <Text fontSize="md" bold mb={3}>
              Informacoes pessoais
            </Text>
            <Input
              placeholder="CNPJ"
              value={cnpj}
              onChangeText={setCnpj}
              InputRightElement={
                <Icon
                  as={Feather}
                  name={!cnpj ? 'x' : 'check'}
                  size={8}
                  ml="2"
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
                  size={8}
                  ml="2"
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
                  size={8}
                  ml="2"
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
                  size={8}
                  ml="2"
                  color={!businessEmail ? 'red.500' : 'green.500'}
                />
              }
            />

            <Text fontSize="md" bold py={5}>
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
                  size={8}
                  ml="2"
                  color={correctZipCode ? 'red.500' : 'green.500'}
                />
              }
            />

            <Input
              placeholder="Endereço"
              value={addressLine}
              onChangeText={setAddressLine}
              InputRightElement={
                <Icon
                  as={Feather}
                  name={!addressLine ? 'x' : 'check'}
                  size={8}
                  ml="2"
                  color={!addressLine ? 'red.500' : 'green.500'}
                />
              }
            />
            <Input
              placeholder="Número"
              onChangeText={setNumber}
              value={number}
              InputRightElement={
                <Icon
                  as={Feather}
                  name={!number ? 'x' : 'check'}
                  size={8}
                  ml="2"
                  color={!number ? 'red.500' : 'green.500'}
                />
              }
            />
            <Input
              placeholder="Bairro"
              value={district}
              onChangeText={setDistrict}
              InputRightElement={
                <Icon
                  as={Feather}
                  name={!district ? 'x' : 'check'}
                  size={8}
                  ml="2"
                  color={!district ? 'red.500' : 'green.500'}
                />
              }
            />
            <Input
              placeholder="Cidade"
              value={city}
              onChangeText={setCity}
              InputRightElement={
                <Icon
                  as={Feather}
                  name={!city ? 'x' : 'check'}
                  size={8}
                  ml="2"
                  color={!city ? 'red.500' : 'green.500'}
                />
              }
            />
            <Input
              placeholder="Estado"
              value={state}
              onChangeText={setState}
              InputRightElement={
                <Icon
                  as={Feather}
                  name={!state ? 'x' : 'check'}
                  size={8}
                  ml="2"
                  color={!state ? 'red.500' : 'green.500'}
                />
              }
            />

            <VStack mb={5} py={5}>
              <Text fontSize="md" pb={5} bold>
                Meios de pagamentos oferecidos
              </Text>
              <VStack>
                <Checkbox.Group>
                  {paymentMethods.map((item) => (
                    <Checkbox
                      value={item.id.toString()}
                      colorScheme="orange"
                      mb={5}
                      onChange={() => setPaymentMethodsHandler(item.id)}
                      key={item.id}
                    >
                      <Text fontSize="md">{item.name}</Text>
                    </Checkbox>
                  ))}
                </Checkbox.Group>
              </VStack>
            </VStack>

            <VStack py={5}>
              <Text fontSize="md" pb={5} bold>
                Tipos de serviços oferecidos
              </Text>
              <VStack flexGrow={1}>
                <Checkbox.Group>
                  {services.map((item) => (
                    <Checkbox
                      value={item.id.toString()}
                      colorScheme="orange"
                      mb={5}
                      key={item.id}
                      onChange={() => setServicesHandler(item.id)}
                    >
                      <Text fontSize="md">{item.name}</Text>
                    </Checkbox>
                  ))}
                </Checkbox.Group>
              </VStack>
            </VStack>

            <VStack py={5}>
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

            <VStack py={5}>
              <Text fontSize="md" bold pb={5}>
                Horário de funcionamento
              </Text>
              <HStack>
                <VStack w={100}>
                  <Input
                    placeholder={'Das'}
                    editable={false}
                    value={openHour}
                    caretHidden
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
                  <Text>as</Text>
                </VStack>
                <VStack w={100}>
                  <Input
                    placeholder={'até'}
                    editable={false}
                    value={closeHour}
                    caretHidden
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

            <VStack py={5}>
              <Text bold pb={5}>
                Bio
              </Text>
              <TextArea
                placeholder="Conte nos um pouco sobre o seu negócio,
              ele pode ser o diferencial para o cliente escolher o seu estabelecimento."
                h={150}
                value={businessDescription}
                onChangeText={setBusinessDescription}
                fontSize="sm"
                borderRadius={10}
              />
            </VStack>
            {/* <VStack>
              <Text fontSize="md" pb={5} bold>
                Adicione fotos do local
              </Text>
              <VStack maxW={400} flexWrap="wrap">
                {photos.map((photo) => (
                  <HStack>
                    <TouchableOpacity onPress={() => setShowModal(true)}>
                      <HStack mb={5}>
                        <Image
                          w={'full'}
                          height={200}
                          source={photo}
                          alt="Some thing in the way"
                          resizeMode="cover"
                        />
                      </HStack>
                    </TouchableOpacity>

                    <HStack>
                      <Modal
                        isOpen={showModal}
                        onClose={() => setShowModal(false)}
                      >
                        <Modal.Content>
                          <Modal.Body>
                            <Image
                              source={photo}
                              alt="Photo"
                              resizeMode="contain"
                            />
                          </Modal.Body>
                        </Modal.Content>
                      </Modal>
                    </HStack>
                  </HStack>
                ))}

                <Button
                  title="Carregar foto"
                  variant="outline"
                  onPress={handleUserProfilePictureSelect}
                />
              </VStack>
            </VStack> */}
            <Button title="Salvar" onPress={handleSubmitBusiness} mt={150} />
          </VStack>
        </ScrollView>
      </VStack>
    </VStack>
  );
}
