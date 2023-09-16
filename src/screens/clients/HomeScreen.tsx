import ImageHeaderPng from '@assets/header.png';
import EngineService from '@assets/services/car-engine.png';
import WashService from '@assets/services/car-service.png';
import GearService from '@assets/services/gear.png';
import GlassService from '@assets/services/glass.png';
import OilService from '@assets/services/oil.png';
import EletricService from '@assets/services/spark-plug.png';
import PaintService from '@assets/services/spray-gun.png';
import SuspensionService from '@assets/services/suspension.png';
import AccessoriesService from '@assets/services/usb.png';
import WhellService from '@assets/services/wheel.png';
import AssistanceService from '@assets/services/worker.png';
import { FavoriteCars } from '@components/FavoriteCars';
import { ReminderBell } from '@components/ReminderBell';
import { ServicesSmallCard } from '@components/ServicesSmallCard';
import { SmallSchedulleCard } from '@components/SmallSchedulleCard';
import { UserLocation } from '@components/UserLocation';
import { UserPhoto } from '@components/UserPhoto';
import { ISchedules } from '@dtos/ISchedules';
import { IVehicleDTO } from '@dtos/IVechicleDTO';
import { Fontisto } from '@expo/vector-icons';
import { useAuth } from '@hooks/useAuth';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { AppNavigatorRoutesProps } from '@routes/app.routes';
import { api } from '@services/api';
import {
  HStack,
  ScrollView,
  VStack,
  Text,
  Center,
  Pressable,
  FlatList,
  Icon,
  Image,
} from 'native-base';
import { useCallback, useState } from 'react';
import { TouchableOpacity } from 'react-native';

async function fetchUserVehicles(user_id: string) {
  const response = await api.get('/vehicles/', {
    headers: {
      id: user_id,
    },
  });

  return response;
}

async function fetchSchedules(user_id: string) {
  const response = await api.get('/schedules/', {
    headers: {
      id: user_id,
    },
  });

  return response;
}

export function HomeScreen() {
  const [vehicles, setVehicles] = useState<IVehicleDTO[]>([]);
  const [schedules, setSchedules] = useState<ISchedules[]>([]);

  const { user } = useAuth();

  const navigation = useNavigation<AppNavigatorRoutesProps>();

  function greeting() {
    const hours = new Date().getHours();
    if (hours >= 0 && hours < 12) {
      return 'Bom dia';
    }
    if (hours >= 12 && hours < 18) {
      return 'Boa tarde';
    }
    return 'Boa noite';
  }

  useFocusEffect(
    useCallback(() => {
      fetchUserVehicles(user.id).then((response) => setVehicles(response.data));
      fetchSchedules(user.id).then((response) => setSchedules(response.data));
    }, [])
  );

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <VStack>
        <HStack justifyContent="space-between">
          <VStack justifyContent={'space-between'} px={3}>
            <HStack justifyItems={'baseline'} mb={2}>
              <HStack ml={2} pt={5}>
                <Icon
                  as={Fontisto}
                  name="map-marker-alt"
                  size={30}
                  color="orange.600"
                />
                <VStack>
                  <Text bold>Olá, {`${user.name}`}</Text>
                  <UserLocation />
                </VStack>
              </HStack>
            </HStack>
          </VStack>

          <VStack alignItems="center" justifyContent="center" mt={5} mr={5}>
            <Icon as={Fontisto} name="bell" size={5} color="orange.600" />
          </VStack>
        </HStack>
      </VStack>

      <VStack width={400} height={200}>
        <Image source={ImageHeaderPng} alt="header" resizeMethod="resize" />
      </VStack>

      {/* <VStack mt={10}>
        <HStack justifyContent={'space-between'}>
          <Text bold ml={5}>
            Meus Veículos
          </Text>

          <Pressable onPress={() => navigation.navigate('vehicles')}>
            <Text px={5} color="gray.400">
              Ver todos
            </Text>
          </Pressable>
        </HStack>
      </VStack> */}

      {/* <FlatList
        px={5}
        py={5}
        horizontal={true}
        data={vehicles}
        ListFooterComponent={() => <Text>1</Text>}
        renderItem={({ item }) => (
          <HStack pr={10}>
            <FavoriteCars vehicle={item} key={item.id} />
          </HStack>
        )}
        ListEmptyComponent={() => (
          <Center bg="white">
            <Text color="gray.400">Você não possui veículos cadastrados</Text>
            <Text color="orange.600" bold>
              Toque aqui para adicionar
            </Text>
          </Center>
        )}
      />

      <VStack>
        <HStack justifyContent={'space-between'}>
          <Text bold mb={2} ml={5}>
            Escolha um serviço
          </Text>

          <TouchableOpacity>
            <Text mb={2} mr={5} color="gray.400">
              Ver todos
            </Text>
          </TouchableOpacity>
        </HStack>

        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          ml={3}
        >
          <ServicesSmallCard
            image={EngineService}
            alt="mecânico"
            title="Mecânico"
          />
          <ServicesSmallCard
            image={EletricService}
            alt="eletrico"
            title="Eletrica"
          />
          <ServicesSmallCard
            image={WashService}
            alt="limpeza"
            title="limpeza"
          />
          <ServicesSmallCard image={GearService} alt="cambio" title="Cambio" />
          <ServicesSmallCard
            image={AssistanceService}
            alt="assistencia"
            title="Assistencia"
          />
          <ServicesSmallCard
            image={AccessoriesService}
            alt="acessorios"
            title="Acessorios"
          />

          <ServicesSmallCard image={GlassService} alt="vidros" title="Vidros" />

          <ServicesSmallCard image={OilService} alt="fluidos" title="Fluidos" />

          <ServicesSmallCard
            image={PaintService}
            alt="funilaria e pintura"
            title="Pintura"
          />

          <ServicesSmallCard
            image={SuspensionService}
            alt="suspensão"
            title="Suspensão"
          />

          <ServicesSmallCard
            image={WhellService}
            alt="borracharia"
            title="Borracharia"
          />
        </ScrollView>
      </VStack>

      <VStack mt={5} px={5}>
        <Text bold mb={2} ml={3}>
          Parceiros Recomendados
        </Text>
        <TouchableOpacity>
          <VStack w={370} h={100} bg="white" rounded={5}></VStack>
        </TouchableOpacity>
      </VStack>

      <VStack px={5}>
        <HStack justifyContent={'space-between'} alignContent={'baseline'}>
          <Text bold mb={2}>
            Agendamentos
          </Text>
        </HStack>

        <FlatList
          data={schedules}
          horizontal={true}
          renderItem={({ item }) => (
            <VStack
              borderWidth={1}
              borderColor="gray.700"
              mb={3}
              borderRadius={5}
              shadow={0.8}
              key={item.id}
            >
              <SmallSchedulleCard data={item} key={item.id} />
            </VStack>
          )}
          ListEmptyComponent={() => (
            <VStack px={10} py={5}>
              <Center>
                <Text color="gray.400">Você não possui agendamentos</Text>
                <TouchableOpacity
                  onPress={() => navigation.navigate('schedules')}
                >
                  <Text color="orange.600" bold>
                    Toque aqui para agendar
                  </Text>
                </TouchableOpacity>
              </Center>
            </VStack>
          )}
        /> */}
      {/* </VStack> */}
    </ScrollView>
  );
}
