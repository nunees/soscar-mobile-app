import { Box, HStack, IBoxProps } from "native-base";

type Props = IBoxProps & {
  color?: string;
};

export function LineDivider({ color = "gray.700", ...rest }: Props) {
  return (
    <HStack>
      <Box
        w={"100%"}
        h={1}
        backgroundColor={color}
        mt={5}
        mb={10}
        {...rest}
      ></Box>
    </HStack>
  );
}
