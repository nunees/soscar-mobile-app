import { Button as ButtonNativeBase, IButtonProps, Text } from "native-base";

type ButtonProps = IButtonProps & {
  title: string;
  variant?: "solid" | "outline";
};

export function Button({ title, variant = "solid", ...rest }: ButtonProps) {
  return (
    <ButtonNativeBase
      w="full"
      h={14}
      bg={variant === "solid" ? "orange.600" : "transparent"}
      rounded="lg"
      _pressed={{ bg: variant === "outline" ? "orange.600" : "orange.900" }}
      borderWidth={variant === "outline" ? 2 : 0}
      borderColor={variant === "outline" ? "orange.600" : "transparent"}
      {...rest}
    >
      <Text
        color={variant === "outline" ? "orange.500" : "white"}
        fontFamily={"heading"}
        fontSize={"sm"}
      >
        {title}
      </Text>
    </ButtonNativeBase>
  );
}
