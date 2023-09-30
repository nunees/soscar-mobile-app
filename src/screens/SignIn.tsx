import BackgroundPNG from '@assets/login/background.png';
import { Button } from '@components/Button';
import { Input } from '@components/Input';
import { Feather } from '@expo/vector-icons';
import { yupResolver } from '@hookform/resolvers/yup';
import { useAuth } from '@hooks/useAuth';
import { useNavigation } from '@react-navigation/native';
import { AuthNavigatorRoutesProps } from '@routes/auth.routes';
import { AppError } from '@utils/AppError';
import {
  Center,
  Heading,
  VStack,
  Text,
  useToast,
  HStack,
  Icon,
  Image,
} from 'native-base';
import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Pressable, TouchableOpacity, ScrollView } from 'react-native';
import * as yup from 'yup';

type FormDataProps = {
  email: string;
  password: string;
};

const loginSchema = yup.object().shape({
  email: yup.string().required('Informe um e-mail'),
  password: yup.string().required('Informe uma senha'),
});

export function SignIn() {
  const [isLoading, setIsLoading] = useState(false);

  const { signIn } = useAuth();
  const navigation = useNavigation<AuthNavigatorRoutesProps>();
  const toast = useToast();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormDataProps>({
    resolver: yupResolver(loginSchema),
  });

  function handleSignUp() {
    navigation.navigate('SignUp');
  }

  async function handleSignIn({ email, password }: FormDataProps) {
    try {
      setIsLoading(true);
      await signIn(email, password);
    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError ? error.message : 'Erro ao realizar login';

      toast.show({
        title,
        placement: 'bottom',
        bgColor: 'red.500',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <VStack flex={1} backgroundColor="purple.900">
      <ScrollView
        contentContainerStyle={{
          paddingBottom: 20,
        }}
      >
        <VStack>
          <VStack width={'full'} height={400}>
            <Image
              source={BackgroundPNG}
              alt="background image"
              resizeMode="cover"
            />
          </VStack>
        </VStack>

        <VStack
          backgroundColor="purple.900"
          borderTopLeftRadius={10}
          borderTopRightRadius={10}
          flex={1}
        >
          <VStack px={10} py={3}>
            <Heading color="gray.100">Bem-vindo!</Heading>
            <Text color="gray.200">Faça login para continuar</Text>
          </VStack>

          <VStack>
            <VStack>
              <VStack ml={5}></VStack>
              <Center px={10} mt={2}>
                <Controller
                  control={control}
                  name="email"
                  rules={{ required: 'Informe seu e-mail' }}
                  render={({ field: { onChange, value } }) => (
                    <Input
                      InputLeftElement={
                        <Icon
                          as={Feather}
                          name="mail"
                          size={5}
                          ml={2}
                          color="gray.400"
                        />
                      }
                      selectionColor={'white'}
                      backgroundColor={'transparent'}
                      color="gray.100"
                      fontSize="md"
                      placeholder="Email"
                      autoCapitalize="none"
                      keyboardType="email-address"
                      onChangeText={onChange}
                      value={value}
                      errorMessage={errors.email?.message}
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="password"
                  rules={{ required: 'Informe sua senha' }}
                  render={({ field: { onChange, value } }) => (
                    <Input
                      InputLeftElement={
                        <Icon
                          as={Feather}
                          name="key"
                          size={5}
                          ml={2}
                          color="gray.400"
                        />
                      }
                      backgroundColor={'transparent'}
                      color="gray.100"
                      fontSize="md"
                      placeholder="Senha"
                      autoCapitalize="none"
                      secureTextEntry
                      onChangeText={onChange}
                      value={value}
                      errorMessage={errors.password?.message}
                    />
                  )}
                />

                <HStack justifyContent={'space-between'}>
                  <TouchableOpacity>
                    <Text bold color="purple.200" fontSize="xs">
                      Esqueci minha senha
                    </Text>
                  </TouchableOpacity>
                </HStack>

                <Button
                  title="Acessar"
                  mt={5}
                  onPress={handleSubmit(handleSignIn)}
                  isLoading={isLoading}
                />

                <HStack mt={5}>
                  <Text fontSize="xs" color="gray.100">
                    Não tem uma conta?
                  </Text>
                  <Pressable onPress={handleSignUp}>
                    <Text bold color="purple.200" pl={1} fontSize="xs">
                      Registre-se
                    </Text>
                  </Pressable>
                </HStack>
              </Center>
            </VStack>
          </VStack>
        </VStack>
      </ScrollView>
    </VStack>
  );
}
