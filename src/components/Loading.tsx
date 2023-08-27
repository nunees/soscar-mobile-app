import { Spinner, VStack, Text } from 'native-base';

export function Loading() {
  return (
    <VStack alignItems="center" mt={300}>
      <Spinner
        color="orange.500"
        accessibilityLabel="Carregando dados, aguarde"
        size={50}
      />
      <Text pt={10} fontSize="md" bold>
        Carregando dados, aguarde
      </Text>
    </VStack>
  );
}
