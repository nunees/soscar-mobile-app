import { Button } from '@components/Button';
import { Input } from '@components/Input';
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
  Icon,
  Box,
} from 'native-base';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Eye, EyeClosed } from 'phosphor-react-native';
import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Pressable, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
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
  const [showPassword, setShowPassword] = useState(false);

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
        placement: 'top',
        bgColor: 'red.500',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <SafeAreaView>
      <Box>
        <VStack borderBottomRadius={40} pb={70} bg={'white'}>
          <VStack>
            <Center mt={20}>
              <Heading size="xl" fontFamily={'body'} color="gray.900">
                sos.
                <Heading size="xl" fontFamily={'body'} color="purple.700">
                  auto
                </Heading>
              </Heading>
              <Text color={'gray.500'} px={20} textAlign={'center'}>
                Encontre profissionais ou preste servicos, tudo em um so lugar.
              </Text>
            </Center>

            <Center mt={110} px={10}>
              <Text pb={5} fontSize={'sm'} color="gray.700">
                Acesse sua conta
              </Text>

              <Controller
                control={control}
                name="email"
                rules={{ required: 'Informe seu e-mail' }}
                render={({ field: { onChange, value } }) => (
                  <Input
                    placeholder="E-mail"
                    autoCapitalize="none"
                    fontSize={'md'}
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
                    placeholder="Senha"
                    autoCapitalize="none"
                    fontSize={'md'}
                    secureTextEntry={!showPassword}
                    onChangeText={onChange}
                    value={value}
                    InputRightElement={
                      <Pressable onPress={() => setShowPassword(!showPassword)}>
                        <Icon
                          as={showPassword ? <Eye /> : <EyeClosed />}
                          size={20}
                          color={'gray.400'}
                          mr={2}
                        />
                      </Pressable>
                    }
                    errorMessage={errors.password?.message}
                  />
                )}
              />

              <Center mb={5}>
                <TouchableOpacity
                  onPress={() => navigation.navigate('recoverPassword')}
                >
                  <Text fontSize={'xs'} color="purple.700" bold>
                    Esqueceu sua senha?
                  </Text>
                </TouchableOpacity>
              </Center>

              <Button
                title="Acessar"
                variant={'dark'}
                onPress={handleSubmit(handleSignIn)}
                isLoading={isLoading}
              />
            </Center>
          </VStack>
        </VStack>

        <VStack px={10}>
          <Center mt={5}>
            <Text fontSize={'md'} color="gray.600" pb={5}>
              Ainda nao tem acesso?
            </Text>
            <Button
              title="Criar uma conta"
              variant={'light'}
              onPress={handleSignUp}
            />
          </Center>
        </VStack>

        <Center mt={5}>
          <Text color="gray.600" fontSize={'xs'}>
            Versao 1.0.0 (beta-release)
          </Text>
        </Center>
      </Box>
    </SafeAreaView>
  );
}
