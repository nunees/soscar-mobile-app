import { AppHeader } from '@components/AppHeader';
import { Button } from '@components/Button';
import { Input } from '@components/Input';
import { LoadingModal } from '@components/LoadingModal';
import { TextArea } from '@components/TextArea';
import { UserPhoto } from '@components/UserPhoto';
import { ILocation } from '@dtos/ILocation';
import { Entypo, Feather } from '@expo/vector-icons';
import { useAuth } from '@hooks/useAuth';
import { useProfile } from '@hooks/useProfile';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import { PartnerNavigatorRoutesProps } from '@routes/partner.routes';
import { api } from '@services/api';
import { AppError } from '@utils/AppError';
import { GetAddressByCEP } from '@utils/GetAddressByCEP';
import { IFileInfo } from 'expo-file-system';
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import {
  VStack,
  Text,
  useToast,
  ScrollView,
  HStack,
  Icon,
  Checkbox,
  Image,
} from 'native-base';
import { useState, useCallback } from 'react';
import {
  ImageBackground,
  Pressable,
  Touchable,
  TouchableOpacity,
} from 'react-native';

type RouteParamProps = {
  locationId: string;
};

const paymentMethods = [
  { id: 1, name: 'Dinheiro' },
  { id: 2, name: 'Crédito' },
  { id: 3, name: 'Débito' },
  { id: 4, name: 'PIX' },
  { id: 5, name: 'Transferencia' },
  { id: 6, name: 'Outros' },
];

const servicesCategories = [
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

export function EditLocation() {
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

  const [location, setLocation] = useState<ILocation>({} as ILocation);
  const [isLoading, setIsLoading] = useState(false);

  const routes = useRoute();
  const toast = useToast();
  const { user } = useAuth();
  const { profile } = useProfile();

  const { locationId } = routes.params as RouteParamProps;
  const navigation = useNavigation<PartnerNavigatorRoutesProps>();

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
  const [selectedPaymentMethods, setSelectedPaymentMethods] = useState<
    number[]
  >([]);
  const [selectedBusinessServices, setSelectedBusinessServices] = useState<
    number[]
  >([]);
  const [businessDescription, setBusinessDescription] = useState('');

  const [correctZipCode, setCorrectZipCode] = useState(false);

  const [isUploading, setIsUploading] = useState(false);
  const [openDays, setOpenDays] = useState<string[]>([]);
  const [openHour, setOpenHour] = useState('');
  const [closeHour, setCloseHour] = useState('');

  async function handleUserProfilePictureSelect(field: string) {
    try {
      setIsLoading(true);
      const photoSelected = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
        aspect: [8, 8],
        allowsEditing: true,
      });

      if (photoSelected.canceled) {
        return;
      }

      if (photoSelected.assets[0].uri) {
        const photoInfo = (await FileSystem.getInfoAsync(
          photoSelected.assets[0].uri
        )) as IFileInfo;

        if (photoInfo?.size && photoInfo.size / 1021 / 1024 > 5) {
          toast.show({
            title: 'A imagem deve ter no máximo 5MB',
            placement: 'top',
            bgColor: 'red.500',
          });
        }

        const fileExtension = photoSelected.assets[0].uri.split('.').pop();

        const file = {
          name: `${user.username}.${fileExtension}`.toLowerCase(),
          uri: photoSelected.assets[0].uri,
          type: `${photoSelected.assets[0].type}/${fileExtension}`,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any;

        const userPhotoUploadForm = new FormData();

        if (field === 'avatar') {
          userPhotoUploadForm.append('avatar', file);

          await api.put(
            `/locations/avatar/${location.id}`,
            userPhotoUploadForm,
            {
              headers: {
                id: user.id,
                'Content-Type': 'multipart/form-data',
              },
            }
          );
        } else if (field === 'cover_photo') {
          console.log('cover_photo');
          userPhotoUploadForm.append('cover', file);
          await api.put(
            `/locations/cover/${location.id}`,
            userPhotoUploadForm,
            {
              headers: {
                id: user.id,
                'Content-Type': 'multipart/form-data',
              },
            }
          );
        } else {
          throw new AppError('Erro ao atualizar foto');
        }

        toast.show({
          title: 'Foto atualizada',
          placement: 'top',
          bgColor: 'green.500',
        });
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error);
      const isAppError = error instanceof AppError;
      const title = isAppError ? error.message : 'Erro na atualização';
      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500',
      });
    } finally {
      setIsLoading(false);
    }
  }

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

      const response = await api.patch(
        `/locations/${location.id}`,
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

  async function handleFetchLocationDetails() {
    try {
      const response = await api.get(`/locations/${locationId}`, {
        headers: {
          id: user.id,
        },
      });

      setLocation(response.data);
    } catch (error) {
      toast.show({
        title: 'Erro ao carregar detalhes da localização',
        placement: 'top',
        bgColor: 'red.500',
      });
    }
  }

  useFocusEffect(
    useCallback(() => {
      handleFetchLocationDetails();
    }, [])
  );

  return (
    <VStack>
      <VStack>
        <AppHeader title="Editar local" />
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
          contentContainerStyle={{ paddingBottom: 200 }}
          style={{
            paddingTop: 20,
          }}
        >
          <VStack px={5}>
            <VStack backgroundColor="white" borderRadius={10} mb={20}>
              <VStack w={'full'} height={150} borderRadius={10}>
                <VStack>
                  <Image
                    source={{
                      uri: `${api.defaults.baseURL}/locations/cover/${location?.id}/${location?.cover_photo}`,
                    }}
                    alt="Foto de capa"
                    resizeMode="cover"
                  />
                  <HStack
                    width={30}
                    height={30}
                    borderRadius={100}
                    backgroundColor="orange.500"
                    alignItems="center"
                    justifyContent="center"
                    position="absolute"
                    bottom={-10}
                    right={0}
                    shadow={1}
                  >
                    <TouchableOpacity
                      onPress={() =>
                        handleUserProfilePictureSelect('cover_photo')
                      }
                    >
                      <Icon as={Entypo} name="camera" size={4} color="white" />
                    </TouchableOpacity>
                  </HStack>
                </VStack>
                <VStack h={120} position={'absolute'}>
                  <HStack position="absolute" top={10} left={120}>
                    <UserPhoto
                      source={{
                        uri: location.avatar
                          ? `${api.defaults.baseURL}/locations/avatar/${location?.id}/${location?.avatar}`
                          : `https://ui-avatars.com/api/?format=png&name=${user.name}+${profile.last_name}`,
                      }}
                      alt="Foto de perfil"
                      size={150}
                      borderRadius={100}
                    />

                    <VStack
                      width={30}
                      height={30}
                      borderRadius={100}
                      backgroundColor="orange.500"
                      position="absolute"
                      bottom={0}
                      left={100}
                      alignItems="center"
                      justifyContent="center"
                      shadow={1}
                    >
                      <TouchableOpacity
                        onPress={() => handleUserProfilePictureSelect('avatar')}
                      >
                        <Icon
                          as={Entypo}
                          name="camera"
                          size={4}
                          color="white"
                        />
                      </TouchableOpacity>
                    </VStack>
                  </HStack>
                </VStack>
              </VStack>
            </VStack>

            <VStack p={5} mb={5} borderRadius={10} backgroundColor="white">
              <Text fontSize="md" bold mb={3}>
                Informacoes pessoais
              </Text>
              <Input
                placeholder="CNPJ ou CPF"
                value={location.cnpj || cnpj}
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
                value={location.business_name || businessName}
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
                value={location.business_phone || businessPhone}
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
                value={location.business_email || businessEmail}
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
                value={location.zipcode || zipCode}
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
                value={location.address_line || addressLine}
                onChangeText={setAddressLine}
                editable={false}
                isDisabled={true}
                caretHidden={true}
                showSoftInputOnFocus={false}
              />
              <Input
                placeholder="Número"
                onChangeText={setNumber}
                value={String(location.number) || number}
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
                value={location.district || district}
                onChangeText={setDistrict}
                editable={false}
                isDisabled={true}
                caretHidden={true}
                showSoftInputOnFocus={false}
              />
              <Input
                placeholder="Cidade"
                value={location.city || city}
                onChangeText={setCity}
                editable={false}
                isDisabled={true}
                caretHidden={true}
                showSoftInputOnFocus={false}
              />
              <Input
                placeholder="Estado"
                value={location.state || state}
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
                    value={location?.open_hours?.split('-')[0] || openHour}
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
                    value={location.open_hours?.split('-')[1] || closeHour}
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
                value={location.business_description || businessDescription}
                onChangeText={setBusinessDescription}
                fontSize="sm"
                borderRadius={5}
              />
            </VStack>

            <Button title="Salvar alteracoes" onPress={handleSubmitBusiness} />
          </VStack>
        </ScrollView>
      </VStack>
    </VStack>
  );
}
