import ProfilePicture from '@assets/profile.png';
import { AddPhoto } from '@components/AddPhoto';
import { AppHeader } from '@components/AppHeader';
import { Button } from '@components/Button';
import { Input } from '@components/Input';
import { Select } from '@components/Select';
import { SelectBusinessCategories } from '@components/SelectBusinessCategories';
import { TextArea } from '@components/TextArea';
import { UserPhoto } from '@components/UserPhoto';
import { ILocation } from '@dtos/ILocation';
import { IVehicleDTO } from '@dtos/IVechicleDTO';
import { Feather } from '@expo/vector-icons';
import { useAuth } from '@hooks/useAuth';
import { useRoute } from '@react-navigation/native';
import { api } from '@services/api';
import { ImagePickerAsset } from 'expo-image-picker';
import {
  VStack,
  ScrollView,
  Image,
  HStack,
  Heading,
  Text,
  Center,
  useToast,
  Icon,
} from 'native-base';
import { useEffect, useState } from 'react';

type RouteParamsProps = {
  locationId: string;
  typeofService: number;
};

type VehicleSelect = {
  label: string;
  value: string;
};

export function NewSchedule() {
  const [location, setLocation] = useState<ILocation>();
  const [profilePicture, setProfilePicture] = useState<ImagePickerAsset>();
  const [userVehicles, setUserVehicles] = useState<IVehicleDTO[]>();
  const [choosedVehicle, setChoosedVehicle] = useState<string>();
  const [services, setServices] = useState<number[]>();

  const [requiredServic, setRequiredServices] = useState<number>();

  const routes = useRoute();
  const { locationId, typeofService } = routes.params as RouteParamsProps;

  const { user } = useAuth();
  const toast = useToast();

  async function fetchData() {
    try {
      const response = await api.get(`/locations/${locationId}`, {
        headers: {
          id: user.id,
        },
      });
      setLocation(response.data);
      setServices(response.data.business_categories);
      console.log(response.data);

      const profilePicture = await api.get(
        `/user/avatar/${response.data.user_id}/${response.data.users.avatar}`
      );
      setProfilePicture(profilePicture.data);

      const vehicles = await api.get(`/vehicles`, {
        headers: {
          id: user.id,
        },
      });
      setUserVehicles(vehicles.data);
    } catch (error) {
      toast.show({
        title: 'Erro ao buscar parceiros',
        placement: 'top',
        bgColor: 'red.500',
      });
    }
  }

  console.log(choosedVehicle);

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <VStack pb={10}>
      <VStack>
        <AppHeader title="Novo agendamento" />
      </VStack>

      <ScrollView showsVerticalScrollIndicator={false} marginBottom={100}>
        <VStack>
          {location ? (
            <VStack px={5}>
              <VStack>
                <HStack>
                  <VStack ml={2} mb={3}>
                    <UserPhoto
                      source={profilePicture}
                      alt="Profile Picture"
                      size={10}
                    />
                    <Heading>{location.business_name}</Heading>
                    <Text>100 Avaliações</Text>
                    <Text>{location.users?.name}</Text>
                    <Text>Telefone: {location.business_phone}</Text>
                  </VStack>
                  <VStack position="relative" left={150} top={10}>
                    <Icon as={Feather} name="message-square" size={8} />
                  </VStack>
                </HStack>
              </VStack>
            </VStack>
          ) : (
            <VStack px={5} py={5}></VStack>
          )}

          <VStack px={5} mt={5}>
            <SelectBusinessCategories
              label={'Tipo de Serviço'}
              categoryOfService={typeofService}
              onValueChange={(value) => setRequiredServices(Number(value))}
            />

            <Select
              label={'Selecione um veículo'}
              data={
                userVehicles
                  ? userVehicles.map((item) => {
                      return {
                        label: `${item.brand.name} - ${item.name.name}`,
                        value: String(item.id),
                      } as VehicleSelect;
                    })
                  : []
              }
              onValueChange={(value) => setChoosedVehicle(value)}
            />

            <Input placeholder={'Data'} w={200} />

            <Input placeholder={'Horário'} w={200} />

            <TextArea placeholder={'Problemas relatados'} w={'full'} h={150} />

            <VStack>
              <HStack mb={5}>
                <Text fontSize="xs" bold color="gray.500">
                  Você pode adicionar fotos ou videos adicionais que demonstram
                  os problemas relatados
                </Text>
              </HStack>
              <AddPhoto />
            </VStack>

            <Button title="Agendar" mt={100} />
          </VStack>
        </VStack>
      </ScrollView>
    </VStack>
  );
}
