import { IImageProps, Image } from 'native-base';
import { memo } from 'react';

type Props = IImageProps & {
  size: number;
};

function UserPhoto({ size, ...rest }: Props) {
  return (
    <Image
      w={size}
      h={size}
      borderRadius={100}
      borderColor="purple.700"
      {...rest}
    />
  );
}

export default memo(UserPhoto);
