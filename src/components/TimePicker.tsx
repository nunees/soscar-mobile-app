import { FontAwesome5 } from '@expo/vector-icons';
import { Input, IInputProps, Icon } from 'native-base';

type Props = IInputProps & {
  onPress: () => void;
};

export function TimePicker({ onPress, ...rest }: Props) {
  return (
    <Input
      editable={false}
      isDisabled={true}
      caretHidden
      textAlign="center"
      fontSize={'lg'}
      fontWeight={'bold'}
      InputRightElement={
        <Icon
          as={FontAwesome5}
          name="clock"
          size={8}
          mr={3}
          color="gray.900"
          onPress={onPress}
        />
      }
      {...rest}
    />
  );
}
