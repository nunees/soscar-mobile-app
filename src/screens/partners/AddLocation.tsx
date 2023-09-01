import { AppHeader } from '@components/AppHeader';
import { Button } from '@components/Button';
import { Input } from '@components/Input';
import { TextArea } from '@components/TextArea';
import { useAuth } from '@hooks/useAuth';
import { api } from '@services/api';
import { AppError } from '@utils/AppError';
import { IFileInfo } from 'expo-file-system';
import * as FileSystem from 'expo-file-system';
import { ImagePickerAsset } from 'expo-image-picker';
import * as ImagePicker from 'expo-image-picker';
import {
  ScrollView,
  VStack,
  Text,
  Checkbox,
  useToast,
  HStack,
  Image,
  Modal,
} from 'native-base';
import { useState } from 'react';
import { TouchableOpacity } from 'react-native';

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
  const [selectedPaymentMethods, setSelectedPaymentMethods] = useState<
    number[]
  >([]);
  const [selectedBusinessServices, setSelectedBusinessServices] = useState<
    number[]
  >([]);
  const [businessDescription, setBusinessDescription] = useState('');

  const [photos, setPhotos] = useState<ImagePickerAsset[]>([]);
  const [isPhotoLoading, setIsPhotoLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const { user } = useAuth();
  const toast = useToast();

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

  async function handleUserProfilePictureSelect() {
    try {
      setIsPhotoLoading(true);
      const photoSelected = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
        aspect: [4, 4],
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

        const photoFile = {
          name: `${user.username}.${fileExtension}`.toLowerCase(),
          uri: photoSelected.assets[0].uri,
          type: `${photoSelected.assets[0].type}/${fileExtension}`,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any;

        setPhotos([...photos, photoFile]);

        toast.show({
          title: 'Foto adicionada',
          placement: 'top',
          bgColor: 'green.500',
        });
        setIsPhotoLoading(false);
      }
    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError ? error.message : 'Erro na atualização';
      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500',
      });
      setIsPhotoLoading(false);
    } finally {
      setIsPhotoLoading(false);
    }
  }

  async function handleSubmitBusiness() {
    try {
      // const response = await api.post(
      //   '/locations',
      //   {
      //     cnpj,
      //     business_name: businessName,
      //     business_phone: businessPhone,
      //     business_email: businessPhone,
      //     address_line: addressLine,
      //     number: Number(number),
      //     city,
      //     district,
      //     state,
      //     zipcode: zipCode,
      //     payment_methods: selectedPaymentMethods,
      //     business_categories: selectedBusinessServices,
      //     business_description: businessDescription,
      //   },
      //   {
      //     headers: {
      //       id: user.id,
      //     },
      //   }
      // );

      // if (photos.length > 0) {
      await api.patch(
        `/locations/8da90eec-c3fc-4a11-93eb-9f0bb82a27f4/upload`,
        {},
        {
          headers: {
            id: user.id,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      // }
      toast.show({
        title: 'Fotos enviadas',
        placement: 'top',
        bgColor: 'green.500',
      });
    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError ? error.message : 'Erro ao realizar cadastro';
      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500',
      });
    }
  }

  return (
    <VStack flex={1}>
      <VStack>
        <AppHeader title="Adicionar Local" />
      </VStack>

      <VStack>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 120 }}
        >
          <VStack py={10} px={19}>
            <Input placeholder="CNPJ" value={cnpj} onChangeText={setCnpj} />
            <Input
              placeholder="Nome Fantasia"
              value={businessName}
              onChangeText={setBusinessName}
            />
            <Input
              placeholder="Telefone"
              value={businessPhone}
              onChangeText={setBusinessPhone}
            />
            <Input
              placeholder="Email"
              value={businessEmail}
              onChangeText={setBusinessEmail}
            />
            <Input
              placeholder="Endereço"
              value={addressLine}
              onChangeText={setAddressLine}
            />
            <Input
              placeholder="Número"
              onChangeText={setNumber}
              value={number}
            />
            <Input
              placeholder="Bairro"
              value={district}
              onChangeText={setDistrict}
            />
            <Input placeholder="Cidade" value={city} onChangeText={setCity} />
            <Input placeholder="Estado" value={state} onChangeText={setState} />
            <Input
              placeholder="CEP"
              value={zipCode}
              onChangeText={setZipCode}
            />
            <VStack mb={5}>
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
            <VStack>
              <Text fontSize="md" bold pb={2}>
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
            <TextArea
              placeholder="Descricao do local"
              h={120}
              value={businessDescription}
              onChangeText={setBusinessDescription}
            />
            <VStack>
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
            </VStack>
            <Button title="Salvar" onPress={handleSubmitBusiness} mt={100} />
          </VStack>
        </ScrollView>
      </VStack>
    </VStack>
  );
}
