import { Entypo } from '@expo/vector-icons';
import { Input, IInputProps, Icon } from 'native-base';
import { View } from 'react-native';

type Props = IInputProps;

export function SearchBox({ ...rest }: Props) {
  return (
    <View {...rest}>
      <Input
        fontFamily={'body'}
        fontSize={'sm'}
        placeholder="O que procura?"
        placeholderTextColor={'gray.400'}
        rounded={50}
        _focus={{
          background: 'white',
          borderColor: 'gray.400',
          borderWidth: 1,
        }}
        {...rest}
        InputRightElement={
          <Icon
            as={Entypo}
            name={'magnifying-glass'}
            size={5}
            color="muted.400"
            mr="5"
          />
        }
      />
    </View>
  );
}
