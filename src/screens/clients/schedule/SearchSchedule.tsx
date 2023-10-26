import { AppHeader } from '@components/AppHeader';
import { ListEmpty } from '@components/ListEmpty';
import { LoadingModal } from '@components/LoadingModal';
import { PartnerCard } from '@components/PartnerCard';
import { ILocation } from '@dtos/ILocation';
import { useAxiosFetch } from '@hooks/axios/useAxiosFetch';
import { useAuth } from '@hooks/useAuth';
import { useNavigation, useRoute } from '@react-navigation/native';
import { AppNavigatorRoutesProps } from '@routes/app.routes';
import { VStack, FlatList } from 'native-base';

type RouteParamsProps = {
  serviceId: string;
};

export function SearchSchedule() {
  const navigation = useNavigation<AppNavigatorRoutesProps>();
  const { user } = useAuth();

  const routes = useRoute();
  const { serviceId } = routes.params as RouteParamsProps;

  const { state } = useAxiosFetch<ILocation[]>({
    method: 'GET',
    url: `/locations/services/${serviceId}`,
    headers: {
      id: user.id,
    },
  });

  return (
    <VStack pb={10}>
      <VStack mb={5}>
        <AppHeader
          title="Parceiros disponiveis"
          navigation={navigation}
          screen="schedules"
        />
      </VStack>

      {state.isLoading && (
        <LoadingModal
          showModal={state.isLoading}
          message="Buscando parceiros"
        />
      )}

      <FlatList
        contentContainerStyle={{ paddingBottom: 100 }}
        data={state.data}
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
