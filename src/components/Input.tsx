import {
  Input as NativeBaseInput,
  FormControl,
  IInputProps,
} from "native-base";

type Props = IInputProps & {
  errorMessage?: string | null;
};

export function Input({ errorMessage = null, isInvalid, ...rest }: Props) {
  const invalid = !!errorMessage;

  return (
    <FormControl isInvalid={invalid} mb={4}>
      <NativeBaseInput
        borderTopWidth={0}
        borderLeftWidth={0}
        borderRightWidth={0}
        h={14}
        px={4}
        borderWidth={2}
        fontSize="md"
        color="gray.200"
        fontFamily={"body"}
        placeholderTextColor="gray.500"
        isInvalid={invalid}
        _invalid={{
          borderWidth: 2,
          borderColor: "red.500",
        }}
        _focus={{
          bg: "white",
          borderColor: "orange.500",
          borderWidth: 2,
        }}
        {...rest}
      />
      <FormControl.ErrorMessage>{errorMessage}</FormControl.ErrorMessage>
    </FormControl>
  );
}
