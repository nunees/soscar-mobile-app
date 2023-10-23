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
import { AppError } from '@utils/AppError';
import { VStack, FlatList, useToast } from 'native-base';
import { useCallback, useState } from 'react';

type RouteParamsProps = {
  serviceId: string;
};

export function SearchSchedule() {
  const [isLoading, setIsLoading] = useState(false);

  const [locations, setLocations] = useState<ILocation[]>({} as ILocation[]);

  const navigation = useNavigation<AppNavigatorRoutesProps>();
  const { user } = useAuth();
  const toast = useToast();

  const routes = useRoute();
  const { serviceId } = routes.params as RouteParamsProps;

  const findLocations = useCallback(
    async (serviceId: string, user_id: string) => {
      try {
        setIsLoading(true);
        const response = await api.get(`/locations/services/${serviceId}`, {
          headers: {
            id: user_id,
          },
        });

        setLocations(response.data);
      } catch (error) {
        const isAppError = error instanceof AppError;
        const message = isAppError ? error.message : 'Erro ao buscar locais';
        toast.show({
          title: message,
          placement: 'top',
          bgColor: 'red.500',
        });
      } finally {
        setIsLoading(false);
      }
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
        <AppHeader
          title="Parceiros disponiveis"
          navigation={navigation}
          screen="schedules"
        />
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
          contentContainerStyle={{ paddingBottom: 100 }}
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
