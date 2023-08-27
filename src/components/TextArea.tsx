import {
  TextArea as NativeTextArea,
  ITextAreaProps,
  FormControl,
} from 'native-base';

type Props = ITextAreaProps & {
  errorMessage?: string | null;
};

export function TextArea({ errorMessage = null, ...rest }: Props) {
  const invalid = !!errorMessage;
  return (
    <FormControl isInvalid={invalid} mb={4}>
      <NativeTextArea
        autoCompleteType={undefined}
        px={4}
        h={20}
        borderWidth={2}
        fontSize="md"
        color="gray.200"
        fontFamily={'body'}
        placeholderTextColor="gray.500"
        isInvalid={invalid}
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
