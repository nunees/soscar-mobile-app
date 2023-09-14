import { VStack, Text } from 'native-base';

type Props = {
  message: string;
};

export function ListEmpty({ message }: Props) {
  return (
    <VStack>
      <Text>{message}</Text>
    </VStack>
  );
}
