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

import TopHeader from "@assets/login/top-header.png";

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
    // <VStack flex={0.8}>
    //   <Image
    //     width={428}
    //     height={392}
    //     source={TopHeader}
    //     defaultSource={TopHeader}
    //     alt="Top Header"
    //   />
    //   <VStack flex={1}>
    //     <VStack>
    //       <Center>
    //         <Heading
    //           pb={10}
    //           fontWeight={"light"}
    //           fontSize={40}
    //           color="gray.400"
    //         >
    //           Login
    //         </Heading>

    //         <Controller
    //           control={control}
    //           name="email"
    //           rules={{ required: "Informe seu e-mail" }}
    //           render={({ field: { onChange, value } }) => (
    //             <Input
    //               borderTopWidth={0}
    //               borderLeftWidth={0}
    //               borderRightWidth={0}
    //               placeholder="Email"
    //               autoCapitalize="none"
    //               keyboardType="email-address"
    //               onChangeText={onChange}
    //               value={value}
    //               errorMessage={errors.email?.message}
    //             />
    //           )}
    //         />

    //         <Controller
    //           control={control}
    //           name="password"
    //           rules={{ required: "Informe sua senha" }}
    //           render={({ field: { onChange, value } }) => (
    //             <Input
    //               borderTopWidth={0}
    //               borderLeftWidth={0}
    //               borderRightWidth={0}
    //               placeholder="Senha"
    //               autoCapitalize="none"
    //               secureTextEntry
    //               onChangeText={onChange}
    //               value={value}
    //               errorMessage={errors.password?.message}
    //             />
    //           )}
    //         />

    //         <Box alignSelf="flex-end">
    //           <TouchableOpacity>
    //             <Text fontWeight={"bold"} color="gray.400">
    //               Esqueci minha senha
    //             </Text>
    //           </TouchableOpacity>
    //         </Box>

    //         <Button
    //           title="Acessar"
    //           mt={10}
    //           onPress={handleSubmit(handleSignIn)}
    //           isLoading={isLoading}
    //         />

    //         <Text pt={5} pb={5}>
    //           ou
    //         </Text>

    //         <Button title="Registre-se" onPress={handleSignUp} />

    //         <TouchableOpacity style={{ marginTop: 50 }}>
    //           <Text>Ajuda</Text>
    //         </TouchableOpacity>

    //         <Text mt={5}>Versão 1.0.0</Text>
    //       </Center>
    //     </VStack>
    //   </VStack>
    // </VStack>
    <ScrollView flex={1}>
      <VStack>
        <Image
          width={428}
          height={392}
          source={TopHeader}
          resizeMode="cover"
          position={"absolute"}
          top={-100}
          defaultSource={TopHeader}
          alt="Top Header"
          zIndex={-1}
        />
      </VStack>
      <VStack mt={250} flex={1}>
        <VStack>
          <VStack ml={5}>
            <Text bold fontSize="xlg">
              Login
            </Text>
            <Text color="gray.500" fontSize="xs">
              Por favor, entre com suas credencias para continuar
            </Text>
          </VStack>
          <Center px={10} mt={5}>
            <Controller
              control={control}
              name="email"
              rules={{ required: "Informe seu e-mail" }}
              render={({ field: { onChange, value } }) => (
                <Input
                  backgroundColor="gray.700"
                  borderColor="transparent"
                  fontSize="sm"
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
                  backgroundColor="gray.700"
                  borderColor="transparent"
                  fontSize="sm"
                  placeholder="Senha"
                  autoCapitalize="none"
                  secureTextEntry
                  onChangeText={onChange}
                  value={value}
                  errorMessage={errors.password?.message}
                />
              )}
            />

            <Box alignSelf="flex-end">
              <TouchableOpacity>
                <Text fontWeight={"bold"} color="orange.700" fontSize="xs">
                  Esqueci minha senha
                </Text>
              </TouchableOpacity>
            </Box>

            <Button
              title="Acessar"
              mt={10}
              onPress={handleSubmit(handleSignIn)}
              isLoading={isLoading}
            />

            <HStack mt={5}>
              <Text fontSize="xs">Não tem uma conta?</Text>
              <Pressable onPress={handleSignUp}>
                <Text color="orange.700" bold pl={1} fontSize="xs">
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
