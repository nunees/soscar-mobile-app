import { Feather } from '@expo/vector-icons';
import {
  Text,
  VStack,
  Pressable,
  IPressableProps,
  Icon,
  HStack,
} from 'native-base';

type Props = IPressableProps & {
  title: string;
  icon?: string;
  text: string;
};

export function ServiceCardTypes({ title, icon, text, ...rest }: Props) {
  return (
    <VStack px={5}>
      <Pressable {...rest}>
        <HStack
          w={'full'}
          p={5}
          borderColor="gray.600"
          style={{
            borderTopWidth: 0,
            borderLeftWidth: 0,
            borderRightWidth: 0,
            borderBottomWidth: 1,
          }}
        >
          <Icon as={Feather} name={icon} size={10} color="gray.300" />
          <HStack flexDirection={'column'} pl={5}>
            <Text bold>{title}</Text>
            <Text width={300}>{text}</Text>
          </HStack>
        </HStack>
      </Pressable>
    </VStack>
  );
}
