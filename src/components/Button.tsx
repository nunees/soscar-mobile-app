import { Feather } from '@expo/vector-icons';
import {
  Button as ButtonNativeBase,
  IButtonProps,
  Icon,
  Text,
} from 'native-base';

type ButtonProps = IButtonProps & {
  title?: string;
  variant?: 'solid' | 'outline';
  hasIcon?: boolean;
  iconName?: string;
};

export function Button({
  title,
  variant = 'solid',
  hasIcon,
  iconName,
  ...rest
}: ButtonProps) {
  return (
    <ButtonNativeBase
      w="full"
      h={14}
      bg={variant === 'solid' ? 'orange.600' : 'transparent'}
      rounded="lg"
      _pressed={{ bg: variant === 'outline' ? 'orange.600' : 'orange.900' }}
      borderWidth={variant === 'outline' ? 2 : 0}
      borderColor={variant === 'outline' ? 'orange.600' : 'transparent'}
      {...rest}
    >
      {!hasIcon && (
        <Text bold color={variant === 'solid' ? 'white' : 'orange.600'}>
          {title}
        </Text>
      )}
      {hasIcon && <Icon as={Feather} name={iconName} size={8} color="white" />}
    </ButtonNativeBase>
  );
}
