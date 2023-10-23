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
  fontSize?: string;
};

export function Button({
  title,
  variant = 'dark',
  hasIcon,
  iconName,
  iconSize = 8,
  fontSize = 'md',
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
          ? 'purple.400'
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
          color={
            variant === 'dark'
              ? 'white'
              : variant === 'light'
              ? 'white'
              : 'purple.400'
          }
          fontSize={fontSize}
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
