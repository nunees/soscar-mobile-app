import { AppHeader } from '@components/AppHeader';
import { ListEmpty } from '@components/ListEmpty';
import { PartnerCard } from '@components/PartnerCard';
import { ILocation } from '@dtos/ILocation';
import { useAuth } from '@hooks/useAuth';
import { useNavigation, useRoute } from '@react-navigation/native';
import { AppNavigatorRoutesProps } from '@routes/app.routes';
import { api } from '@services/api';
import { AppError } from '@utils/AppError';
import { VStack, useToast, FlatList } from 'native-base';
import { useEffect, useState } from 'react';

type RouteParamsProps = {
  serviceId: string;
};

export function SearchSchedule() {
  const [locations, setLocations] = useState<ILocation[]>();

  const navigation = useNavigation<AppNavigatorRoutesProps>();
  const toast = useToast();
  const { user } = useAuth();

  const routes = useRoute();
  const { serviceId } = routes.params as RouteParamsProps;

  async function findLocations(serviceId: string) {
    try {
      const response = await api.get(`/locations/services/${serviceId}`, {
        headers: {
          id: user.id,
        },
      });
      console.table(response.data);
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
                    `${api.defaults.baseURL}/user/avatar/${item.user_id}/${item.users?.avatar}` ||
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
