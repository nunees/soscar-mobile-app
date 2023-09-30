import {
  Input as NativeBaseInput,
  FormControl,
  IInputProps,
  WarningOutlineIcon,
} from 'native-base';

type Props = IInputProps & {
  errorMessage?: string | null;
  helperText?: string;
};

export function Input({
  errorMessage = null,
  isInvalid,
  helperText,
  ...rest
}: Props) {
  const invalid = !!errorMessage;

  return (
    <FormControl isInvalid={invalid} mb={4}>
      <NativeBaseInput
        h={14}
        px={4}
        borderRadius={8}
        fontSize="md"
        fontFamily="body"
        borderWidth={1}
        color="gray.600"
        placeholderTextColor="gray.400"
        isInvalid={isInvalid}
        _invalid={{
          borderWidth: 2,
          borderColor: 'red.500',
        }}
        _focus={{
          bg: 'white',
          borderColor: 'purple.500',
          borderWidth: 2,
        }}
        {...rest}
      />

      {helperText && (
        <FormControl.HelperText>{helperText}</FormControl.HelperText>
      )}
      <FormControl.ErrorMessage rightIcon={<WarningOutlineIcon size="xs" />}>
        {errorMessage}
      </FormControl.ErrorMessage>
    </FormControl>
  );
}
