import {
  Input as NativeBaseInput,
  FormControl,
  IInputProps,
} from 'native-base';

type Props = IInputProps & {
  errorMessage?: string | null;
};

export function Input({ errorMessage = null, isInvalid, ...rest }: Props) {
  const invalid = !!errorMessage;

  return (
    <FormControl isInvalid={invalid} mb={4}>
      <NativeBaseInput
        h={14}
        px={4}
        fontSize="md"
        borderWidth={1}
        color="gray.200"
        fontFamily={'body'}
        placeholderTextColor="gray.500"
        isInvalid={isInvalid}
        _invalid={{
          borderWidth: 2,
          borderColor: 'red.500',
        }}
        _focus={{
          bg: 'white',
          borderColor: 'orange.500',
          borderWidth: 2,
        }}
        {...rest}
      />
      <FormControl.ErrorMessage>{errorMessage}</FormControl.ErrorMessage>
    </FormControl>
  );
}
