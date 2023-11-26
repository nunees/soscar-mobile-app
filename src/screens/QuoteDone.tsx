import TaskDoneSVG from '@assets/taskdone.svg';
import { Button } from '@components/Button';
import { useNavigation } from '@react-navigation/native';
import { AppNavigatorRoutesProps } from '@routes/app.routes';
import { Center, Heading, VStack, Text } from 'native-base';
import { SafeAreaView } from 'react-native-safe-area-context';

export function QuoteDone() {
  const navigation = useNavigation<AppNavigatorRoutesProps>();

  return (
    <SafeAreaView>
      <VStack px={5} py={10}>
        <Center mt={50}>
          <Heading pb={3}>Tudo certo 👍</Heading>
          <Text textAlign={'center'}>
            Seu pedido de orçamento foi enviado com sucesso.
          </Text>
          <TaskDoneSVG width={300} height={300} />
          <Text px={5} textAlign={'center'}>
            O profissional analisara seu caso e te retornara em breve
          </Text>
        </Center>
      </VStack>

      <VStack px={5} py={10}>
        <Button
          onPress={() => navigation.navigate('home')}
          title="Ir para home"
        />
      </VStack>
    </SafeAreaView>
  );
}
