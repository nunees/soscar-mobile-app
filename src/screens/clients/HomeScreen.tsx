import CalendarImage from '@assets/services/calendar.png';
import CompliantImage from '@assets/services/compliant.png';
import PaperImage from '@assets/services/paper.png';
import { Button } from '@components/Button';
import { SearchBar } from '@components/SearchBar';
import { ServiceCardTypes } from '@components/ServiceCardTypes';
import { SmallSchedulleCard } from '@components/SmallSchedulleCard';
import UserPhoto from '@components/UserPhoto';
import { ISchedules } from '@dtos/ISchedules';
import { useAuth } from '@hooks/useAuth';
import { useGPS } from '@hooks/useGPS';
import { useProfile } from '@hooks/useProfile';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { AppNavigatorRoutesProps } from '@routes/app.routes';
import { api } from '@services/api';
import {
  HStack,
  ScrollView,
  VStack,
  Text,
  Badge,
  FlatList,
  Center,
} from 'native-base';
import { useCallback, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

export function HomeScreen() {
  const { user } = useAuth();
  const { profile, updateProfile } = useProfile();

  const [schedules, setSchedules] = useState<ISchedules[]>([]);

  const navigation = useNavigation<AppNavigatorRoutesProps>();
  const { coords } = useGPS();

  const fetchUserData = useCallback(async (user_id: string) => {
    const response = await api.get(`/user/profile/${user_id}`, {
      headers: {
        id: user_id,
      },
    });
    return response;
  }, []);

  const fetchSchedules = useCallback(async (user_id: string) => {
    const response = await api.get('/schedules/', {
      headers: {
        id: user_id,
      },
    });
    return response;
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchUserData(user.id).then((response) => {
        updateProfile({
          birth_date: response.data.birth_date,
          cpf: response.data.cpf,
          genderId: response.data.genderId,
          last_name: response.data.last_name,
          name: response.data.name,
          phone: response.data.mobile_phone,
        });
      });
      fetchSchedules(user.id).then((response) => {
        setSchedules(response.data);
      });
    }, [])
  );

  return (
    <SafeAreaView>
      <ScrollView showsVerticalScrollIndicator={false}>
        <VStack px={5} py={2}>
          <VStack backgroundColor="white" p={5} borderRadius={10} shadow={1}>
            <HStack justifyContent={'space-between'} alignItems={'center'}>
              <VStack>
                <Text fontSize={'md'} color="gray.700">
                  Boas vindas,
                </Text>
                <Text fontSize={'md'} bold color="gray.700">
                  {user.name}!
                </Text>
              </VStack>
              <VStack>
                <UserPhoto
                  source={{
                    uri: user.avatar
                      ? `${api.defaults.baseURL}/user/avatar/${user.id}/${user.avatar}`
                      : `https://ui-avatars.com/api/?format=png&name=${user.name}W&size=512`,
                  }}
                  alt="Foto de perfil"
                  size={10}
                  borderWidth={3}
                  borderColor="purple.700"
                />
              </VStack>
            </HStack>
            <HStack mt={3}>
              <SearchBar />
            </HStack>
          </VStack>

          <VStack mt={5}>
            <VStack>
              <Text fontSize={'md'} bold pb={3}>
                Seus agendamentos
              </Text>

              <FlatList
                data={schedules}
                horizontal={true}
                renderItem={({ item }) => {
                  return (
                    <VStack
                      borderWidth={1}
                      borderColor="gray.700"
                      mb={3}
                      borderRadius={5}
                      shadow={0.8}
                      key={item.id}
                    >
                      <Badge colorScheme={'purple'} borderRadius={10}>
                        <SmallSchedulleCard data={item} key={item.id} />
                      </Badge>
                    </VStack>
                  );
                }}
                ListEmptyComponent={() => (
                  <Badge colorScheme={'green'} borderRadius={10} p={5} w={350}>
                    <Center>
                      <Text color="green.600">Tudo certo!</Text>
                      <Text color="green.600" bold>
                        Você não possui agendamentos
                      </Text>
                    </Center>
                  </Badge>
                )}
              />
            </VStack>
          </VStack>

          <VStack mt={5}>
            <VStack>
              <Text fontSize={'md'} bold pb={3}>
                Servicos mais procurados
              </Text>
              <ServiceCardTypes
                icon="calendar"
                title={'Agendamento de  serviços'}
                text={'Agende seus serviços sem sair de casa'}
                onPress={() => navigation.navigate('schedules')}
                image={CalendarImage}
                alt="Agendar serviços"
              />

              <ServiceCardTypes
                icon="file-text"
                title={'Orçamento de  serviços'}
                text={'Realize orcamentos sem sair de casa'}
                onPress={() => navigation.navigate('quotes')}
                image={PaperImage}
                alt="Orçamento de serviços"
              />
              <ServiceCardTypes
                icon="briefcase"
                title={'Orçamentos judiciais'}
                text={'Realize orçamentos judiciais sem sair de casa'}
                image={CompliantImage}
                alt="Orçamento judiciais de serviços"
                onPress={() => navigation.navigate('legalQuotes')}
              />

              {/* <ServiceCardTypes
                icon="compass"
                title={'Encontre um profissional'}
                text={'Encontre um profissional para realizar seu serviço'}
                image={FindImage}
                alt="Encontre um profissional para realizar seu serviço"
              /> */}
            </VStack>
          </VStack>
        </VStack>
      </ScrollView>
    </SafeAreaView>
  );
}
