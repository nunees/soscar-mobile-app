import { HStack, Text } from 'native-base';
import { memo } from 'react';
import { TouchableOpacity } from 'react-native';

type Props = {
  data: string | number;
  isToggled: boolean;
  handleOpenDays: (data: string | number) => void;
};

function ButtonSelection({ data, isToggled, handleOpenDays }: Props) {
  return (
    <TouchableOpacity onPress={() => handleOpenDays(data)}>
      <HStack
        p={3}
        m={2}
        borderWidth={2}
        borderRadius={10}
        borderColor="purple.800"
        backgroundColor={isToggled ? 'purple.600' : 'white'}
      >
        <Text bold color={isToggled ? 'white' : 'gray.400'}>
          {data}
        </Text>
      </HStack>
    </TouchableOpacity>
  );
}

export default memo(ButtonSelection);
