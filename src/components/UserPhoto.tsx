import { IImageProps, Image } from 'native-base';

type Props = IImageProps & {
  size: number;
};

export function UserPhoto({ size, ...rest }: Props) {
  return (
    <Image
      w={size}
      h={size}
      borderRadius={100}
      borderColor="purple.400"
      {...rest}
    />
  );
}
