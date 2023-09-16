import { AppHeader } from '@components/AppHeader';
import { ListEmpty } from '@components/ListEmpty';
import { LoadingModal } from '@components/LoadingModal';
import { PartnerCard } from '@components/PartnerCard';
import { ILocation } from '@dtos/ILocation';
import { useAuth } from '@hooks/useAuth';
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import { AppNavigatorRoutesProps } from '@routes/app.routes';
import { api } from '@services/api';
import { VStack, useToast, FlatList } from 'native-base';
import { useCallback, useState } from 'react';

type RouteParamsProps = {
  serviceId: string;
};

async function findLocations(serviceId: string, user_id: string) {
  const response = await api.get(`/locations/services/${serviceId}`, {
    headers: {
      id: user_id,
    },
  });
  return response;
}

export function SearchSchedule() {
  const [isLoading, setIsLoading] = useState(false);
  const [locations, setLocations] = useState<ILocation[]>();

  const navigation = useNavigation<AppNavigatorRoutesProps>();
  const { user } = useAuth();
  const toast = useToast();

  const routes = useRoute();
  const { serviceId } = routes.params as RouteParamsProps;

  useFocusEffect(
    useCallback(() => {
      console.log('Mounted');
      setIsLoading(true);
      findLocations(serviceId, user.id)
        .then((response) => setLocations(response.data))
        .catch((error) => {
          toast.show({
            title:
              'Erro ao buscar parceiros, verifique sua conexão com a internet',
            placement: 'top',
            bgColor: 'red.500',
          });
          throw new Error(error);
        });
      setIsLoading(false);
      return () => {
        setLocations([]);
      };
    }, [findLocations, serviceId])
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
