import { Spinner, VStack, Text, Center } from 'native-base';

export function Loading() {
  return (
    <VStack flex={1} mt={300}>
      <Center>
        <Spinner
          color="purple.500"
          accessibilityLabel="Carregando dados, aguarde"
          size={50}
        />
        <Text pt={10} fontSize="md" bold>
          Carregando dados, aguarde
        </Text>
      </Center>
    </VStack>
  );
}
