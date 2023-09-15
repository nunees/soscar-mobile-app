import { VStack, Text, Center } from 'native-base';

type Props = {
  message: string;
};

export function ListEmpty({ message }: Props) {
  return (
    <VStack>
      <Center>
        <Text>{message}</Text>
      </Center>
    </VStack>
  );
}
