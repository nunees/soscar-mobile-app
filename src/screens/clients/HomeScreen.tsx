import ProfilePicture from "@assets/profile.png";
import EngineService from "@assets/services/car-engine.png";
import WashService from "@assets/services/car-service.png";
import GearService from "@assets/services/gear.png";
import GlassService from "@assets/services/glass.png";
import OilService from "@assets/services/oil.png";
import EletricService from "@assets/services/spark-plug.png";
import PaintService from "@assets/services/spray-gun.png";
import SuspensionService from "@assets/services/suspension.png";
import AccessoriesService from "@assets/services/usb.png";
import WhellService from "@assets/services/wheel.png";
import AssistanceService from "@assets/services/worker.png";
import { ReminderBell } from "@components/ReminderBell";
import { ServicesSmallCard } from "@components/ServicesSmallCard";
import { SmallSchedulleCard } from "@components/SmallSchedulleCard";
import { UserLocation } from "@components/UserLocation";
import { UserPhoto } from "@components/UserPhoto";
import { Feather, Entypo } from "@expo/vector-icons";
import { useAuth } from "@hooks/useAuth";
import { useNavigation } from "@react-navigation/native";
import { AppNavigatorRoutesProps } from "@routes/app.routes";
import { api } from "@services/api";
import {
  HStack,
  Heading,
  ScrollView,
  VStack,
  Text,
  Box,
  Icon,
} from "native-base";
import { TouchableOpacity } from "react-native";

export function HomeScreen() {
  const { user } = useAuth();

  const navigation = useNavigation<AppNavigatorRoutesProps>();

  function greeting() {
    const hours = new Date().getHours();
    if (hours >= 0 && hours < 12) {
      return "Bom dia";
    }
    if (hours >= 12 && hours < 18) {
      return "Boa tarde";
    }
    return "Boa noite";
  }

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <VStack py={10} px={19}>
        <HStack justifyContent={"space-between"}>
          <HStack justifyItems={"baseline"}>
            <TouchableOpacity onPress={() => navigation.navigate("profile")}>
              <UserPhoto
                size={10}
                defaultSource={ProfilePicture}
                source={
                  user.avatar
                    ? { uri: `${api.defaults.baseURL}/user/avatar/${user.id}` }
                    : ProfilePicture
                }
                alt="imagem de perfil"
              />
            </TouchableOpacity>
            <Box ml={2} pb={10}>
              <Heading color="gray.200" fontSize="lg">
                {`${greeting()},`}
              </Heading>
              <Text>{`${user.name}`}</Text>
            </Box>
          </HStack>
          <HStack mt={3}>
            <ReminderBell />
          </HStack>
        </HStack>

        {/*
        <VStack py={10}>
          <HStack justifyContent={"space-between"}>
            <Text bold mb={2} color="gray.200">
              Meus Veículos
            </Text>

            <TouchableOpacity onPress={() => navigation.navigate("vehicles")}>
              <Text mb={2} color="gray.400">
                Ver todos
              </Text>
            </TouchableOpacity>
          </HStack>
          <QuickVehicleCard brand="" model={""} year={0} id={""} />
        </VStack> */}

        <HStack mb={10}>
          <Icon as={Feather} name="map-pin" size={5} color={"gray.400"} />
          <UserLocation />
        </HStack>

        <VStack>
          <HStack justifyContent={"space-between"}>
            <Text bold mb={2}>
              Escolha um serviço
            </Text>

            <TouchableOpacity>
              <Text mb={2} color="gray.400">
                Ver todos
              </Text>
            </TouchableOpacity>
          </HStack>

          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
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
            <ServicesSmallCard
              image={GearService}
              alt="cambio"
              title="Cambio"
            />
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

            <ServicesSmallCard
              image={GlassService}
              alt="vidros"
              title="Vidros"
            />

            <ServicesSmallCard
              image={OilService}
              alt="fluidos"
              title="Fluidos"
            />

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

        <VStack py={10}>
          <Text bold mb={2}>
            Parceiros Recomendados
          </Text>
          <TouchableOpacity>
            <Box w={346} h={176} bg={"gray.700"} rounded={5}></Box>
          </TouchableOpacity>
        </VStack>

        <VStack>
          <HStack justifyContent={"space-between"} alignContent={"baseline"}>
            <Text bold mb={2}>
              Próximos agendamentos
            </Text>
            <TouchableOpacity>
              <Icon
                as={Entypo}
                name="plus"
                size={8}
                color={"gray.400"}
                mr={3}
              />
            </TouchableOpacity>
          </HStack>
          <SmallSchedulleCard />
          <SmallSchedulleCard />
          <SmallSchedulleCard />
        </VStack>
      </VStack>
    </ScrollView>
  );
}
