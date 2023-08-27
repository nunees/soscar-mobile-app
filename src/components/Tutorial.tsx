import { Button } from '@components/Button';
import { Text, Center, Heading } from 'native-base';
import { Image, ImageSourcePropType, ImageURISource } from 'react-native';

type TutorialProps = {
  title: string;
  text: string;
  btnText?: string;
  source: ImageSourcePropType | ImageURISource;
  alt: string;
  nextPage?: () => void;
};

export function Tutorial({
  title,
  text,
  btnText,
  nextPage,
  source,
  alt,
}: TutorialProps) {
  return (
    <Center mt={50}>
      <Heading fontSize="xlg" color="gray.100" pb={10}>
        {title}
      </Heading>
      <Image source={source} alt={alt} />
      <Text
        w="full"
        h={48}
        pt={10}
        color="gray.200"
        fontSize="md"
        textAlign="center"
      >
        {text}
      </Text>
      {btnText && <Button mt={0} title={btnText} onPress={nextPage} />}
    </Center>
  );
}
