import ProfilePicture from '@assets/profile.png';
import { AppHeader } from '@components/AppHeader';
import { Button } from '@components/Button';
import { Input } from '@components/Input';
import { Select } from '@components/Select';
import { TextArea } from '@components/TextArea';
import { Feather } from '@expo/vector-icons';
import {
  VStack,
  ScrollView,
  Image,
  HStack,
  Heading,
  Text,
  Icon,
  Center,
} from 'native-base';

export function NewSchedule() {
  return (
    <VStack pb={10}>
      <VStack mb={10}>
        <AppHeader title="Agendar" />
      </VStack>

      <ScrollView showsVerticalScrollIndicator={false} marginBottom={100}>
        <VStack px={5} py={5}>
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
          <Select label={'Tipo de Serviço'} data={[]} />

          <Select label={'Selecione um veículo'} data={[]} />

          <VStack width={400} alignSelf={'flex-start'}>
            <Input placeholder={'Data'} w={200} />

            <Input placeholder={'Horário'} w={200} />

            <TextArea placeholder={'Problemas relatados'} w={'full'} h={150} />
          </VStack>

          <VStack px={5}>
            <HStack>
              <Heading>Fotos</Heading>
            </HStack>
            <Image source={ProfilePicture} h={20} w={20} alt={'a'} mt={1} />
            <Center>
              <Button title="" hasIcon iconName="plus" w={100} />
            </Center>
          </VStack>

          <Button title="Agendar" mt={100} />
        </VStack>
      </ScrollView>
    </VStack>
  );
}
