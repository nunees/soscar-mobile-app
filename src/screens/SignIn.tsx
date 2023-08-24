import { Button } from "@components/Button";
import { Input } from "@components/Input";
import {
  Center,
  Heading,
  VStack,
  Text,
  Box,
  useToast,
  Image,
  HStack,
  ScrollView,
  Checkbox,
} from "native-base";
import { Pressable, TouchableOpacity } from "react-native";

import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm, Controller } from "react-hook-form";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { AuthNavigatorRoutesProps } from "@routes/auth.routes";
import { useAuth } from "@hooks/useAuth";
import { AppError } from "@utils/AppError";
import axios from "axios";

import LoginHeaderSVG from "@assets/login/login-header.svg";

type FormDataProps = {
  email: string;
  password: string;
};

const loginSchema = yup.object().shape({
  email: yup.string().required("Informe um e-mail"),
  password: yup.string().required("Informe uma senha"),
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
    navigation.navigate("SignUp");
  }

  async function handleSignIn({ email, password }: FormDataProps) {
    try {
      setIsLoading(true);
      await signIn(email, password);
    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError ? error.message : "Erro ao realizar login";

      toast.show({
        title,
        placement: "top",
        bgColor: "red.500",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <ScrollView flex={1}>
      <VStack px={20} width={200} height={80}>
        <LoginHeaderSVG width={200} />
      </VStack>
      <VStack px={10} mt={-10}>
        <Heading pb={2}>Bem-vindo!</Heading>
        <Text>Faça login para continuar</Text>
      </VStack>
      <VStack flex={1}>
        <VStack>
          <VStack ml={5}></VStack>
          <Center px={10} mt={5}>
            <Controller
              control={control}
              name="email"
              rules={{ required: "Informe seu e-mail" }}
              render={({ field: { onChange, value } }) => (
                <Input
                  borderTopWidth={0}
                  borderLeftWidth={0}
                  borderRightWidth={0}
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
              rules={{ required: "Informe sua senha" }}
              render={({ field: { onChange, value } }) => (
                <Input
                  borderTopWidth={0}
                  borderLeftWidth={0}
                  borderRightWidth={0}
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

            <HStack justifyContent={"space-between"}>
              <Checkbox
                colorScheme="orange"
                value={""}
                onChange={() => {}}
                mr={10}
              >
                <Text fontSize="xs">Salvar credenciais</Text>
              </Checkbox>
              <TouchableOpacity>
                <Text fontWeight={"bold"} color="orange.700" fontSize="xs">
                  Esqueci minha senha
                </Text>
              </TouchableOpacity>
            </HStack>

            <Button
              title="Acessar"
              mt={20}
              onPress={handleSubmit(handleSignIn)}
              isLoading={isLoading}
            />

            <HStack mt={5}>
              <Text fontSize="xs">Não tem uma conta?</Text>
              <Pressable onPress={handleSignUp}>
                <Text color="orange.700" pl={1} fontSize="xs">
                  Registre-se
                </Text>
              </Pressable>
            </HStack>
          </Center>
        </VStack>
      </VStack>
    </ScrollView>
  );
}
