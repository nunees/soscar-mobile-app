import TaskDoneSVG from '@assets/taskdone.svg';
import { Button } from '@components/Button';
import { useNavigation, useRoute } from '@react-navigation/native';
import { AppNavigatorRoutesProps } from '@routes/app.routes';
import { Center, Heading, VStack, Text, Image } from 'native-base';
import { SafeAreaView } from 'react-native-safe-area-context';

type RouteParamsProps = {
  date: string;
};

export function TaskDone() {
  const routes = useRoute();
  const { date } = routes.params as RouteParamsProps;

  const navigation = useNavigation<AppNavigatorRoutesProps>();

  return (
    <SafeAreaView>
      <VStack px={5} py={10}>
        <Center mt={50}>
          <Heading>Tudo certo 👍</Heading>
          <Text textAlign={'center'}>
            Seu agendamento para o dia{' '}
            <Text bold>{date.split('-').reverse().join('/')}</Text>, foi
            realizado com sucesso.
          </Text>
          <TaskDoneSVG width={300} height={300} />
        </Center>
      </VStack>

      <VStack px={5} py={10}>
        <Center>
          <Heading>Atenção</Heading>
          <Text textAlign={'center'}>
            Caso não possa comparecer, por favor, cancele seu agendamento.
          </Text>
        </Center>
        <Button
          mt={3}
          onPress={() => null}
          title="Definir lembrete"
          mb={3}
          variant="outline"
        />
        <Button
          onPress={() => navigation.navigate('home')}
          title="Ir para home"
        />
      </VStack>
    </SafeAreaView>
  );
}
