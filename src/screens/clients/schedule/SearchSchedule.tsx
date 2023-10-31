import { AppHeader } from '@components/AppHeader';
import { ListEmpty } from '@components/ListEmpty';
import { LoadingModal } from '@components/LoadingModal';
import { PartnerCard } from '@components/PartnerCard';
import { ILocation } from '@dtos/ILocation';
import { useAuth } from '@hooks/useAuth';
import { useNavigation, useRoute } from '@react-navigation/native';
import { AppNavigatorRoutesProps } from '@routes/app.routes';
import { api } from '@services/api';
import { AppError } from '@utils/AppError';
import { VStack, FlatList, useToast } from 'native-base';
import { useEffect, useState } from 'react';

type RouteParamsProps = {
  serviceId: string;
};

export function SearchSchedule() {
  const [locations, setLocations] = useState<ILocation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation<AppNavigatorRoutesProps>();
  const { user } = useAuth();

  const routes = useRoute();
  const { serviceId } = routes.params as RouteParamsProps;

  const toast = useToast();

  useEffect(() => {
    async function handleSearch() {
      try {
        setIsLoading(true);
        console.log(serviceId);
        const response = await api.get(`/locations/services/${serviceId}`, {
          headers: {
            id: user.id,
          },
        });

        setLocations(response.data);
      } catch (error) {
        const isAppError = error instanceof AppError;
        const message = isAppError ? error.message : 'Erro ao buscar parceiros';
        toast.show({
          title: message,
          placement: 'top',
          bgColor: 'red.500',
        });
      } finally {
        setIsLoading(false);
      }
    }

    handleSearch();
  }, [serviceId]);

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
        <LoadingModal showModal={isLoading} message="Buscando locais" />
      )}

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
  );
}
