/* eslint-disable no-nested-ternary */
import { Feather } from '@expo/vector-icons';
import {
  Button as ButtonNativeBase,
  IButtonProps,
  Icon,
  Text,
} from 'native-base';

type ButtonProps = IButtonProps & {
  title?: string;
  variant?: 'dark' | 'outline' | 'light';
  hasIcon?: boolean;
  iconName?: string;
  iconSize?: number;
};

export function Button({
  title,
  variant = 'dark',
  hasIcon,
  iconName,
  iconSize = 8,
  ...rest
}: ButtonProps) {
  return (
    <ButtonNativeBase
      w="full"
      h={14}
      bg={
        variant === 'dark'
          ? 'purple.800'
          : variant === 'light'
          ? 'white'
          : variant === 'outline'
          ? 'transparent'
          : 'purple.800'
      }
      rounded="lg"
      _pressed={{ bg: variant === 'outline' ? 'purple.600' : 'purple.900' }}
      borderWidth={variant === 'outline' ? 2 : 0}
      borderColor={variant === 'outline' ? 'purple.600' : 'transparent'}
      {...rest}
    >
      {!hasIcon && (
        <Text
          bold
          color={
            variant === 'dark'
              ? 'white'
              : variant === 'light'
              ? 'black'
              : 'white'
          }
          fontSize={'md'}
        >
          {title}
        </Text>
      )}
      {hasIcon && (
        <Icon as={Feather} name={iconName} size={iconSize} color="white" />
      )}
    </ButtonNativeBase>
  );
}
