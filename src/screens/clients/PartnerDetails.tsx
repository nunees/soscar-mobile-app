import ProfilePicture from '@assets/profile.png';
import { AppHeader } from '@components/AppHeader';
import { Button } from '@components/Button';
import { Feather, Entypo } from '@expo/vector-icons';
import {
  ScrollView,
  Text,
  VStack,
  HStack,
  Image,
  Heading,
  Icon,
} from 'native-base';

export function PartnerDetails() {
  return (
    <VStack pb={10}>
      <VStack mb={10}>
        <AppHeader title="Detalhes" />
      </VStack>

      <ScrollView showsVerticalScrollIndicator={false} marginBottom={100}>
        <VStack px={5}>
          <VStack w="full" h={150} borderWidth={1} borderRadius={10}>
            <HStack pt={5}>
              <Image
                source={ProfilePicture}
                h={20}
                w={20}
                rounded={'full'}
                borderWidth={1}
                alt={'a'}
                mt={1}
              />
              <VStack ml={2} mb={3}>
                <Heading>John Doe</Heading>
                <Text>100 Avaliações</Text>
                <Text>Auto Center</Text>
                <Text>Telefone: 99999999</Text>
              </VStack>
              <VStack position="relative" left={120}>
                <Icon as={Feather} name="message-square" size={8} />
              </VStack>
            </HStack>
          </VStack>
        </VStack>

        <VStack px={5} mt={5}>
          <Button title="Agendar" onPress={() => null} />
        </VStack>

        <VStack px={5} mt={5}>
          <HStack>
            <HStack>
              <Icon as={Feather} name="map-pin" size={8} ml={3} mt={1} />
            </HStack>
            <HStack>
              <VStack ml={2}>
                <Text>Rua tralala, 123 - Bairro tralala</Text>
                <Text>0.8km de voce</Text>
              </VStack>
            </HStack>
          </HStack>

          <HStack mt={3}>
            <HStack>
              <Icon as={Feather} name="calendar" size={8} ml={3} mt={1} />
            </HStack>
            <HStack>
              <VStack ml={2}>
                <Text>Datas proximas</Text>
                <Text>Horarios mais procurados</Text>
              </VStack>
            </HStack>
          </HStack>

          <HStack mt={3}>
            <HStack>
              <Icon as={Entypo} name="wallet" size={8} ml={3} />
            </HStack>
            <HStack>
              <VStack ml={2}>
                <Text>Crédito, Débito, Dinheiro e PIX</Text>
              </VStack>
            </HStack>
          </HStack>

          <HStack mt={3}>
            <HStack>
              <Icon as={Feather} name="tool" size={8} ml={3} />
            </HStack>
            <HStack>
              <VStack ml={2}>
                <Text>Especialista em </Text>
              </VStack>
            </HStack>
          </HStack>

          <VStack mt={3}>
            <HStack>
              <Text>Informações adicionais</Text>
            </HStack>
            <HStack mt={3}>
              <HStack>
                <Icon as={Feather} name="user" size={8} ml={3} />
              </HStack>
              <HStack>
                <VStack ml={2}>
                  <Text>Sobre mim </Text>
                  <Text>
                    Mecanico com mais de 10 anos de atuação no mercado,{' '}
                  </Text>
                </VStack>
              </HStack>
            </HStack>

            <HStack>
              <HStack>
                <Icon as={Feather} name="mail" size={8} ml={3} />
              </HStack>
              <HStack>
                <VStack ml={2}>
                  <Text>Email </Text>
                  <Text>Tralala@test.com</Text>
                </VStack>
              </HStack>
            </HStack>

            <HStack>
              <HStack>
                <Icon as={Feather} name="user" size={8} ml={3} />
              </HStack>
              <HStack>
                <VStack ml={2}>
                  <Text>Outros </Text>
                  <Text>
                    Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                    Nisi incidunt delectus hic soluta suscipit recusandae
                    numquam minima ipsum aliquam quos! Ab quam sunt rerum ut
                    excepturi blanditiis optio, nisi illo.
                  </Text>
                </VStack>
              </HStack>
            </HStack>
          </VStack>

          <VStack>
            <Text>Avaliações</Text>
            <HStack>
              <Image source={ProfilePicture} h={10} w={10} alt={'a'} mt={1} />
              <HStack>
                <VStack ml={2}>
                  <Text>John Doe</Text>
                  <Text>Nota</Text>
                  <Text>{new Date().toString()}</Text>
                </VStack>
              </HStack>
            </HStack>
            <Text>
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Sit,
              facere? Eaque, aliquid velit. Beatae nisi, aut iusto rem magni
              doloribus voluptates et tenetur dicta. Earum magni exercitationem
              error consequuntur nihil.
            </Text>
          </VStack>
        </VStack>
      </ScrollView>
    </VStack>
  );
}
