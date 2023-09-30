import { AppHeader } from '@components/AppHeader';
import { Loading } from '@components/Loading';
import { ILocation } from '@dtos/ILocation';
import { Feather } from '@expo/vector-icons';
import { useAuth } from '@hooks/useAuth';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { PartnerNavigatorRoutesProps } from '@routes/partner.routes';
import { api } from '@services/api';
import { AppError } from '@utils/AppError';
import {
  ScrollView,
  VStack,
  Text,
  Fab,
  Icon,
  Heading,
  HStack,
  useToast,
  Badge,
} from 'native-base';
import { useCallback, useState } from 'react';
import { TouchableOpacity, Alert } from 'react-native';

export function Locations() {
  const { user } = useAuth();
  const toast = useToast();

  const [locations, setLocations] = useState<ILocation[]>([]);

  const [isLoading, setIsLoading] = useState(false);

  const navigation = useNavigation<PartnerNavigatorRoutesProps>();

  const loadData = useCallback(async () => {
    try {
      const response = await api.get('/locations', {
        headers: {
          id: user.id,
        },
      });
      setLocations(response.data.locations);
    } catch (error) {
      throw new AppError('Erro ao buscar locais');
    }
  }, [locations]);

  async function handleDeleteLocation(locationId: string) {
    try {
      Alert.alert(
        'Deseja realmente excluir o local?',
        'A acao nao pode ser revertida e voce perdera todos dos dados assiciaods ao local.',
        [
          {
            text: 'Cancelar',
            onPress: () => {},
            style: 'cancel',
          },
          {
            text: 'Excluir',
            onPress: async () => {
              setIsLoading(true);
              try {
                await api.delete(`/locations/${locationId}`, {
                  headers: {
                    id: user.id,
                  },
                });
                toast.show({
                  title: 'Local deletado com sucesso',
                  placement: 'top',
                  bgColor: 'green.500',
                });
                loadData();
              } catch (error) {
                toast.show({
                  title: 'Erro ao deletar local',
                  placement: 'top',
                  bgColor: 'red.500',
                });
              } finally {
                setIsLoading(false);
              }
            },
          },
        ]
      );
    } catch (error) {
      toast.show({
        title: 'Erro ao deletar local',
        placement: 'top',
        bgColor: 'red.500',
      });
    } finally {
      setIsLoading(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  return (
    <VStack flex={1}>
      <VStack>
        <AppHeader title="Meus Locais" />
      </VStack>

      <VStack>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 120 }}
        >
          {isLoading && <Loading />}
          <VStack flex={1}>
            <VStack py={3} px={19}>
              {locations.length > 0 ? (
                locations.map((location) => (
                  <VStack
                    width="full"
                    shadow={2}
                    borderRadius={10}
                    backgroundColor="white"
                    p={5}
                    mb={5}
                    key={location.id}
                  >
                    <HStack
                      justifyContent="center"
                      position="absolute"
                      top={6}
                      right={3}
                    >
                      {location.active ? (
                        <Badge
                          w={50}
                          variant="solid"
                          colorScheme="green"
                          px={2}
                          borderRadius={5}
                        >
                          Ativo
                        </Badge>
                      ) : (
                        <Badge
                          w={60}
                          variant="solid"
                          colorScheme="red"
                          borderRadius={5}
                        >
                          Inativo
                        </Badge>
                      )}
                    </HStack>
                    <Heading pb={5}>
                      {location.business_name.length > 20
                        ? `${location.business_name.slice(
                            0,
                            20
                          )}...`.toUpperCase()
                        : location.business_name.toUpperCase()}
                    </Heading>
                    <Text pb={2}>
                      <Text bold>CNPJ/CPF:</Text> {location.business_phone}
                    </Text>
                    <Text pb={2}>
                      <Text bold>Endereco:</Text> {location.address_line}
                    </Text>
                    <Text pb={2}>
                      <Text bold>Telefone: </Text>
                      {location.business_phone}
                    </Text>
                    <HStack mt={2}>
                      <TouchableOpacity
                        onPress={() =>
                          navigation.navigate('editLocation', {
                            locationId: location.id,
                          })
                        }
                      >
                        <Icon
                          as={Feather}
                          name="edit"
                          size={5}
                          color="purple.500"
                          mr={5}
                        />
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={() => handleDeleteLocation(location.id)}
                      >
                        <Icon
                          as={Feather}
                          name="trash"
                          size={5}
                          color="purple.500"
                          mr={5}
                        />
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={() =>
                          navigation.navigate('locationDetails', {
                            locationId: location.id,
                          })
                        }
                      >
                        <Icon
                          as={Feather}
                          name="info"
                          size={5}
                          color="purple.500"
                          mr={5}
                        />
                      </TouchableOpacity>
                    </HStack>
                  </VStack>
                ))
              ) : (
                <VStack mt={100} alignItems={'center'}>
                  <Text textAlign={'center'} color="gray.500">
                    Não há locais cadastrados.
                  </Text>
                </VStack>
              )}
            </VStack>
          </VStack>
        </ScrollView>
      </VStack>

      <Fab
        position="absolute"
        placement="bottom-right"
        renderInPortal={false}
        size="md"
        colorScheme="purple"
        onPress={() => navigation.navigate('addLocation')}
        icon={<Icon as={Feather} name="plus" size={8} color="white" />}
      />
    </VStack>
  );
}
