import { AppHeader } from '@components/AppHeader';
import { ListEmpty } from '@components/ListEmpty';
import { LoadingModal } from '@components/LoadingModal';
import { PartnerCard } from '@components/PartnerCard';
import { ILocation } from '@dtos/ILocation';
import { useAuth } from '@hooks/useAuth';
import { useGPS } from '@hooks/useGPS';
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import { AppNavigatorRoutesProps } from '@routes/app.routes';
import { api } from '@services/api';
import { VStack, FlatList } from 'native-base';
import { useCallback, useState } from 'react';

type RouteParamsProps = {
  serviceId: string;
};

export function SearchSchedule() {
  const [isLoading, setIsLoading] = useState(false);
  const [locations, setLocations] = useState<ILocation[]>({} as ILocation[]);

  const navigation = useNavigation<AppNavigatorRoutesProps>();
  const { user } = useAuth();

  const routes = useRoute();
  const { serviceId } = routes.params as RouteParamsProps;

  const findLocations = useCallback(
    async (serviceId: string, user_id: string) => {
      const response = await api.get(`/locations/services/${serviceId}`, {
        headers: {
          id: user_id,
        },
      });

      setLocations(response.data);
    },
    [locations]
  );

  useFocusEffect(
    useCallback(() => {
      findLocations(serviceId, user.id);
      return () => {
        setLocations({} as ILocation[]);
      };
    }, [])
  );

  return (
    <VStack pb={10}>
      <VStack mb={5}>
        <AppHeader title="Parceiros disponiveis" />
      </VStack>

      {isLoading && (
        <LoadingModal
          showModal={isLoading}
          setShowModal={setIsLoading}
          message="Buscando parceiros"
        />
      )}

      <VStack>
        <FlatList
          data={locations}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            return (
              <PartnerCard
                onPress={() =>
                  navigation.navigate('newSchedule', {
                    locationId: item.id,
                    typeofService: Number(serviceId),
                  })
                }
                location={item}
                image={{
                  uri:
                    `${api.defaults.baseURL}/locations/avatar/${item.id}/${item.avatar}` ||
                    `https://ui-avatars.com/api/?name=${item.business_name}&background=random&length=1&rounded=true&size=128`,
                }}
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
