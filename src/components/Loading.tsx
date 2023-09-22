import { Spinner, VStack, Text } from 'native-base';

export function Loading() {
  return (
    <VStack alignItems="center" flex={1} w={'full'} h={'full'}>
      <Spinner
        color="purple.500"
        accessibilityLabel="Carregando dados, aguarde"
        size={50}
      />
      <Text pt={10} fontSize="md" bold>
        Carregando dados, aguarde
      </Text>
    </VStack>
  );
}
