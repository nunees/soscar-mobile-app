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
  iconSize?: number;
};

export function Button({
  title,
  variant = 'solid',
  hasIcon,
  iconName,
  iconSize = 8,
  ...rest
}: ButtonProps) {
  return (
    <ButtonNativeBase
      w="full"
      h={14}
      bg={variant === 'solid' ? 'purple.800' : 'transparent'}
      rounded="lg"
      _pressed={{ bg: variant === 'outline' ? 'purple.600' : 'purple.900' }}
      borderWidth={variant === 'outline' ? 2 : 0}
      borderColor={variant === 'outline' ? 'purple.600' : 'transparent'}
      {...rest}
    >
      {!hasIcon && (
        <Text bold color={variant === 'solid' ? 'white' : 'purple.600'}>
          {title}
        </Text>
      )}
      {hasIcon && (
        <Icon as={Feather} name={iconName} size={iconSize} color="white" />
      )}
    </ButtonNativeBase>
  );
}
