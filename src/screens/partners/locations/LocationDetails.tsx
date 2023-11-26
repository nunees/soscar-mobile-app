import { AppHeader } from '@components/AppHeader';
import { Button } from '@components/Button';
import { LoadingModal } from '@components/LoadingModal';
import UserPhoto from '@components/UserPhoto';
import { PAYMENT_TYPES } from '@data/PaymentTypes';
import { SERVICES_TYPES } from '@data/ServicesTypes';
import { ILocation } from '@dtos/ILocation';
import { IReviewDTO } from '@dtos/IReviewDTO';
import { FontAwesome5 } from '@expo/vector-icons';
import { useAuth } from '@hooks/useAuth';
import { useProfile } from '@hooks/useProfile';
import { useUploadImage } from '@hooks/useUploadImage';
import { useNavigation, useRoute } from '@react-navigation/native';
import { AppNavigatorRoutesProps } from '@routes/app.routes';
import { PartnerNavigatorRoutesProps } from '@routes/partner.routes';
import { api } from '@services/api';
import { AppError } from '@utils/AppError';
import {
  VStack,
  Text,
  useToast,
  ScrollView,
  HStack,
  Image,
  FlatList,
  Icon,
  Progress,
  Avatar,
  Heading,
} from 'native-base';
import { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

type RouteParamsProps = {
  locationId: string;
};

export function LocationDetails() {
  const [location, setLocation] = useState<ILocation>({} as ILocation);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');

  const [progressValue, setProgressValue] = useState(0);
  const [isPhotoLoading, setIsPhotoLoading] = useState(false);

  const [reviews, setReviews] = useState<IReviewDTO[]>({} as IReviewDTO[]);

  const routes = useRoute();
  const toast = useToast();
  const { user } = useAuth();
  const { profile } = useProfile();

  const { locationId } = routes.params as RouteParamsProps;

  const partnerNavigation = useNavigation<PartnerNavigatorRoutesProps>();
  const userNavigation = useNavigation<AppNavigatorRoutesProps>();

  const { handleUserProfilePictureSelect } = useUploadImage();

  async function handleLocationPhotos() {
    try {
      setIsPhotoLoading(true);
      setProgressValue(25);

      const fields = await handleUserProfilePictureSelect(user.id, 'photo');

      if (!fields?.userPhotoUploadForm || !fields?.photoFile) {
        throw new AppError('Erro ao selecionar foto');
      }

      setProgressValue(50);

      await api.patch(
        `/locations/upload/new/${location.id}`,
        fields.userPhotoUploadForm,
        {
          headers: {
            id: user.id,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      setProgressValue(100);

      if (user.isPartner) {
        partnerNavigation.navigate('locationDetails', {
          locationId: location.id,
        });
      } else {
        userNavigation.navigate('locationDetails', {
          locationId: location.id,
        });
      }

      toast.show({
        title: 'Foto atualizada',
        placement: 'top',
        bgColor: 'green.500',
      });
      setIsPhotoLoading(false);
    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError ? error.message : 'Erro na atualização';
      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500',
      });
    } finally {
      setIsPhotoLoading(false);
    }
  }

  useEffect(() => {
    async function fetchLocationDetails() {
      try {
        setIsLoading(true);
        setLoadingMessage('Carregando detalhes da localização');
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
      } finally {
        setIsLoading(false);
      }
    }

    fetchLocationDetails();
  }, [locationId, isPhotoLoading]);

  useEffect(() => {
    async function fetchReviews() {
      try {
        const response = await api.get(`/reviews/comments/${locationId}`, {
          headers: {
            id: user.id,
          },
        });

        console.log(response.data);

        setReviews(response.data);
      } catch (error) {
        toast.show({
          title: 'Erro ao carregar avaliações',
          placement: 'top',
          bgColor: 'red.500',
        });
      }
    }

    fetchReviews();
  }, [location]);

  return (
    <SafeAreaView>
      <VStack>
        <AppHeader
          title="Detalhes"
          navigation={user.isPartner ? partnerNavigation : userNavigation}
          screen={user.isPartner ? 'locations' : 'home'}
        />
      </VStack>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 50,
        }}
      >
        {isLoading && (
          <LoadingModal
            showModal={isLoading}
            setShowModal={setIsLoading}
            message={loadingMessage}
          />
        )}

        <FlatList
          horizontal
          data={location.LocationsPhotos}
          pagingEnabled
          indicatorStyle="white"
          snapToAlignment="start"
          decelerationRate={'fast'}
          keyExtractor={(item) => item.id!}
          renderItem={({ item }) => (
            <HStack>
              <Image
                w={500}
                maxW={500}
                h={300}
                maxH={300}
                source={{
                  uri: `${api.defaults.baseURL}/locations/photo/${location.id}/${item.photo}`,
                }}
                alt="Location photo"
              />
            </HStack>
          )}
          ListEmptyComponent={() => (
            <HStack>
              <VStack
                w={500}
                maxW={500}
                h={300}
                maxH={300}
                backgroundColor={'purple.100'}
              >
                {user.isPartner && (
                  <VStack alignSelf={'center'} mr={70} mt={50}>
                    <Text textAlign={'center'} bold>
                      Nenhuma foto adicionada
                    </Text>
                    <Text textAlign={'center'}>
                      Adicione fotos para atrair mais clientes
                    </Text>
                  </VStack>
                )}
                {!user.isPartner && (
                  <VStack alignSelf={'center'} mr={70} mt={50}>
                    <Text textAlign={'center'} bold>
                      Nao ha fotos disponíveis
                    </Text>
                    <Text textAlign={'center'}>
                      Quando o profissional adicionar fotos, elas aparecerão
                      aqui
                    </Text>
                  </VStack>
                )}
              </VStack>
            </HStack>
          )}
        />

        <HStack px={5} py={5}>
          <HStack>
            {user.isPartner && (
              <UserPhoto
                source={{
                  uri: user.avatar
                    ? `${api.defaults.baseURL}/user/avatar/${user.id}/${user.avatar}`
                    : `https://ui-avatars.com/api/?format=png&name=${user.name}+${profile.last_name}&size=512`,
                }}
                alt="Foto de perfil"
                size={10}
              />
            )}
          </HStack>
          <HStack ml={user.isPartner ? 3 : 0}>
            <VStack>
              {user.isPartner && (
                <Text bold fontSize={'xs'}>
                  {user.name}
                </Text>
              )}
              {user.isPartner && (
                <Text fontSize={'xs'}>{location.business_name}</Text>
              )}
              {!user.isPartner && (
                <Heading bold>{location.business_name}</Heading>
              )}
            </VStack>
          </HStack>

          {user.isPartner && (
            <HStack position={'absolute'} right={5} bottom={5}>
              <VStack>
                <Button
                  h={50}
                  variant={'dark'}
                  title="Adicionar Foto"
                  onPress={handleLocationPhotos}
                />
                {isPhotoLoading && (
                  <Progress
                    position={'relative'}
                    top={3}
                    w={100}
                    colorScheme={'purple'}
                    value={progressValue}
                  />
                )}
              </VStack>
            </HStack>
          )}

          {!user.isPartner && (
            <HStack position={'absolute'} right={5} bottom={-10}>
              <Button
                h={50}
                variant={'dark'}
                title="Abrir no Mapa"
                onPress={() => null}
              />
            </HStack>
          )}
        </HStack>

        <VStack px={5}>
          <Text bold fontSize={'xs'} color={'gray.600'} pb={1}>
            Sobre o local
          </Text>
          <Text textAlign={'justify'}>{location.business_description}</Text>
        </VStack>

        <VStack px={5} py={3}>
          <Text bold fontSize={'xs'} color={'gray.600'} pb={1}>
            Local
          </Text>
          <VStack>
            <Text>
              {location.address_line}, {location.number}
            </Text>
            <Text>
              {location.city} - {location.state}
            </Text>
          </VStack>
        </VStack>

        <VStack px={5} py={3}>
          <Text bold fontSize={'xs'} color={'gray.600'} pb={1}>
            Contato
          </Text>
          <VStack>
            <Text>{location.business_phone}</Text>
            <Text>{location.business_email}</Text>
          </VStack>
        </VStack>

        <VStack px={5} py={3}>
          <Text bold fontSize={'xs'} color={'gray.600'} pb={1}>
            Meios de Pagamento
          </Text>
          {location.payment_methods?.map((payment) => {
            return (
              <HStack key={payment}>
                <Icon
                  as={FontAwesome5}
                  name={
                    PAYMENT_TYPES.find((method) =>
                      method.id === payment ? method.name : ''
                    )?.icon
                  }
                  size={5}
                  mr={2}
                />
                <Text>
                  {
                    PAYMENT_TYPES.find((method) =>
                      method.id === payment ? method.name : ''
                    )?.name
                  }
                </Text>
              </HStack>
            );
          })}
        </VStack>

        <VStack px={5} py={3}>
          <Text bold fontSize={'xs'} color={'gray.600'} pb={1}>
            Serviços oferecidos
          </Text>
          <VStack>
            {location.business_categories?.map((category) => {
              return (
                <VStack key={category}>
                  <Text>
                    {
                      SERVICES_TYPES.find((service) =>
                        service.id === category ? service.name : ''
                      )?.name
                    }
                  </Text>
                </VStack>
              );
            })}
          </VStack>
        </VStack>

        <VStack px={5} py={3}>
          <Text bold fontSize={'xs'} color={'gray.600'} pb={1}>
            Horário de funcionamento
          </Text>
          <VStack>
            <Text>
              {location.open_hours_weekend?.length === 5 && 'Segunda a Sexta'}
              {location.open_hours_weekend?.length === 6 && 'Segunda a Sábado'}
              {location.open_hours_weekend?.length === 7 && 'Domingo a Domingo'}
            </Text>
            <Text>{location.open_hours}</Text>
          </VStack>
        </VStack>

        <VStack px={5} py={3}>
          <Text bold fontSize={'xs'} color={'gray.600'} pb={1}>
            Avaliações
          </Text>
          <VStack>
            <FlatList
              data={reviews}
              horizontal
              showsHorizontalScrollIndicator={false}
              snapToAlignment="start"
              pagingEnabled
              renderItem={({ item }) => (
                <VStack>
                  <HStack>
                    <Avatar
                      source={{
                        uri: item.users?.avatar
                          ? `${api.defaults.baseURL}/user/avatar/${item.users?.id}/${item.users?.avatar}`
                          : `https://ui-avatars.com/api/?format=png&name=${item.users?.name}&size=512`,
                      }}
                      size={20}
                      mr={5}
                      mt={2}
                    />
                    <VStack w={250}>
                      <HStack justifyContent={'space-between'}>
                        <Text bold>{item.users?.name}</Text>
                        <Text color={'gray.500'}>Nota: {item.rating}</Text>
                      </HStack>
                      <Text>{item.review}</Text>
                    </VStack>
                  </HStack>
                </VStack>
              )}
            />
          </VStack>
        </VStack>

        <VStack px={5} py={5}>
          {user.isPartner && (
            <Button
              title={'Editar Local'}
              onPress={() =>
                partnerNavigation.navigate('editLocation', {
                  locationId: location.id,
                })
              }
              h={50}
            />
          )}
        </VStack>
      </ScrollView>
    </SafeAreaView>
  );
}
