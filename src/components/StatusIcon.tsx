import { Entypo, Feather } from '@expo/vector-icons';
import { HStack, Icon, VStack } from 'native-base';

type Props = {
  status: number;
  accepted?: boolean;
};

export function StatusIcon({ status, accepted }: Props) {
  return (
    <HStack>
      <HStack alignItems="center">
        {status === 1 && (
          <HStack>
            <VStack>
              <Icon as={Entypo} name="calendar" size={8} color="purple.500" />
            </VStack>
            <HStack pl={3}>
              <Icon
                as={Entypo}
                name="flow-line"
                size={10}
                color="purple.500"
                style={{ transform: [{ rotate: '90deg' }] }}
              />
            </HStack>
          </HStack>
        )}

        {status === 2 && (
          <HStack>
            <VStack>
              <Icon as={Feather} name="calendar" size={8} color="purple.500" />
            </VStack>
            <HStack pl={3}>
              <Icon
                as={Entypo}
                name="flow-line"
                size={10}
                color="purple.500"
                style={{ transform: [{ rotate: '90deg' }] }}
              />
            </HStack>
            <VStack pl={3}>
              <Icon as={Entypo} name="clock" size={8} color="purple.500" />
            </VStack>
          </HStack>
        )}

        {status === 3 && (
          <HStack>
            <VStack>
              <Icon as={Feather} name="calendar" size={8} color="purple.500" />
            </VStack>
            <HStack pl={3}>
              <Icon
                as={Entypo}
                name="flow-line"
                size={10}
                color="purple.500"
                style={{ transform: [{ rotate: '90deg' }] }}
              />
            </HStack>
            <VStack pl={3}>
              <Icon as={Feather} name="clock" size={8} color="purple.500" />
            </VStack>
            <VStack pl={3}>
              <Icon
                as={Entypo}
                name="flow-line"
                size={10}
                color="purple.500"
                style={{ transform: [{ rotate: '90deg' }] }}
              />
            </VStack>
            <VStack pl={3}>
              <Icon as={Feather} name="clipboard" size={8} color="purple.500" />
            </VStack>
          </HStack>
        )}

        {status === 4 && (
          <HStack>
            <VStack>
              <Icon as={Feather} name="calendar" size={8} color="purple.500" />
            </VStack>
            <HStack pl={3}>
              <Icon
                as={Entypo}
                name="flow-line"
                size={10}
                color="purple.500"
                style={{ transform: [{ rotate: '90deg' }] }}
              />
            </HStack>
            <VStack pl={3}>
              <Icon as={Feather} name="clock" size={8} color="purple.500" />
            </VStack>
            <VStack pl={3}>
              <Icon
                as={Entypo}
                name="flow-line"
                size={10}
                color="purple.500"
                style={{ transform: [{ rotate: '90deg' }] }}
              />
            </VStack>
            <VStack pl={3}>
              <Icon as={Feather} name="clipboard" size={8} color="purple.500" />
            </VStack>
            <VStack pl={3}>
              <Icon
                as={Entypo}
                name="flow-line"
                size={10}
                color="purple.500"
                style={{ transform: [{ rotate: '90deg' }] }}
              />
            </VStack>
            <VStack pl={3}>
              <Icon
                as={Feather}
                name={accepted ? 'check-circle' : 'x-circle'}
                size={8}
                color={accepted ? 'green.500' : 'red.500'}
              />
            </VStack>
          </HStack>
        )}
      </HStack>
    </HStack>
  );
}
