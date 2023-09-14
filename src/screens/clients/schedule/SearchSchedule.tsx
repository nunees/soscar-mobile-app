import { AppHeader } from '@components/AppHeader';
import { ListEmpty } from '@components/ListEmpty';
import { PartnerCard } from '@components/PartnerCard';
import { ILocation } from '@dtos/ILocation';
import { useAuth } from '@hooks/useAuth';
import { useProfile } from '@hooks/useProfile';
import { useNavigation, useRoute } from '@react-navigation/native';
import { AppNavigatorRoutesProps } from '@routes/app.routes';
import { api } from '@services/api';
import { AppError } from '@utils/AppError';
import { CalculatePositionDistance } from '@utils/CalculatePositionDistance';
import { VStack, Text, useToast, Center, FlatList } from 'native-base';
import { useEffect, useState } from 'react';

type RouteParamsProps = {
  serviceId: string;
};

export function SearchSchedule() {
  const [locations, setLocations] = useState<ILocation[]>();

  const navigation = useNavigation<AppNavigatorRoutesProps>();
  const toast = useToast();
  const { user } = useAuth();
  const { profile } = useProfile();

  const routes = useRoute();
  const { serviceId } = routes.params as RouteParamsProps;

  async function findLocations(serviceId: string) {
    try {
      const response = await api.get(`/locations/services/${serviceId}`, {
        headers: {
          id: user.id,
        },
      });

      setLocations(response.data);
    } catch (error) {
      const title =
        error instanceof AppError ? error.message : 'Erro ao buscar parceiros';
      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500',
      });
    }
  }

  useEffect(() => {
    findLocations(serviceId);
  }, []);

  return (
    <VStack pb={10}>
      <VStack mb={5}>
        <AppHeader title="Parceiros disponiveis" />
      </VStack>

      {/* <VStack mb={5} px={5}>
        {locations?.length ? (
          locations?.map((location) => {
            const distance = CalculatePositionDistance(
              [Number(profile.latitude), Number(profile.longitude)],
              [Number(location.latitude), Number(location.longitude)]
            );
            return (
              <PartnerCard
                onPress={() =>
                  navigation.navigate('newSchedule', {
                    locationId: location.id,
                    typeofService: Number(serviceId),
                  })
                }
                alt={''}
                name={location.business_name}
                image={{
                  uri:
                    `${api.defaults.baseURL}/user/avatar/${location.user_id}/${location.users?.avatar}` ||
                    `https://ui-avatars.com/api/?name=${location.business_name}&background=random&length=1&rounded=true&size=128`,
                }}
                last_name={''}
                address={`${location.address_line}, ${location.number} - ${location.district}`}
                distance={Math.round(distance)}
                key={location.id}
              />
            );
          })
        ) : (
          <VStack py={200}>
            <Center>
              <Text>Nenhum local encontrado </Text>
            </Center>
          </VStack>
        )}
      </VStack> */}

      <VStack>
        <FlatList
          data={locations}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            const distance = CalculatePositionDistance(
              [Number(profile.latitude), Number(profile.longitude)],
              [Number(item.latitude), Number(item.longitude)]
            );
            return (
              <PartnerCard
                onPress={() =>
                  navigation.navigate('newSchedule', {
                    locationId: item.id,
                    typeofService: Number(serviceId),
                  })
                }
                alt={''}
                name={item.business_name}
                image={{
                  uri:
                    `${api.defaults.baseURL}/user/avatar/${item.user_id}/${item.users?.avatar}` ||
                    `https://ui-avatars.com/api/?name=${item.business_name}&background=random&length=1&rounded=true&size=128`,
                }}
                last_name={''}
                address={`${item.address_line}, ${item.number} - ${item.district}`}
                distance={Math.round(distance)}
                key={item.id}
              />
            );
          }}
          ListEmptyComponent={() => (
            <ListEmpty message="Nenhum local encontrado" />
          )}
        />
      </VStack>
    </VStack>
  );
}
