import { Button } from '@components/Button';
import { Input } from '@components/Input';
import { Select } from '@components/Select';
import { yupResolver } from '@hookform/resolvers/yup';
import { useAuth } from '@hooks/useAuth';
import { useProfile } from '@hooks/useProfile';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import { AuthNavigatorRoutesProps } from '@routes/auth.routes';
import { api } from '@services/api';
import { AppError } from '@utils/AppError';
import {
  Heading,
  ScrollView,
  VStack,
  Text,
  Center,
  useToast,
  HStack,
} from 'native-base';
import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { TouchableOpacity } from 'react-native';
import * as yup from 'yup';

import { genders } from '../data/genders';

type FormDataProps = {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
  name: string;
  lastName: string;
  cpf: string;
  mobile_phone: string;
};

const registrationSchema = yup.object().shape({
  name: yup.string().required('Informe um nome'),
  lastName: yup.string().required('Informe um sobrenome'),
  cpf: yup.string().required('Informe um CPF'),
  mobile_phone: yup.string().required('Informe um número de telefone'),
  email: yup.string().required('Informe um e-mail'),
  username: yup.string().required('Informe um nome de usuário'),
  password: yup.string().required('Informe uma senha'),
  confirmPassword: yup
    .string()
    .required('Confirme sua senha')
    .min(6, 'A senha deve ter no mínimo 6 caracteres')
    .oneOf([yup.ref('password')], 'As senhas devem ser iguais'),
});

export function SignUp() {
  const [isLoading, setIsLoading] = useState(false);
  const [allGenders] = useState(genders);
  const [selectedGender, setSelectedGender] = useState(0);

  const [date, setDate] = useState('');

  const [isClient, setIsClient] = useState(false);
  const [isPartner, setIsPartner] = useState(false);

  const toast = useToast();

  const navigation = useNavigation<AuthNavigatorRoutesProps>();

  const { signIn } = useAuth();
  const { saveProfile } = useProfile();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormDataProps>({
    resolver: yupResolver(registrationSchema),
  });

  function handleDate(date: Date) {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    setDate(`${day}/${month}/${year}`);
  }

  function handleGoBack() {
    navigation.goBack();
  }

  function handleToggleButton() {
    if (isClient) {
      setIsClient(false);
      setIsPartner(true);
    } else {
      setIsClient(true);
      setIsPartner(false);
    }
  }

  async function handleSignClientSignUp({
    name,
    lastName,
    cpf,
    email,
    username,
    password,
    mobile_phone,
  }: FormDataProps) {
    try {
      setIsLoading(true);

      if (isClient && isPartner) {
        setIsLoading(false);
        toast.show({
          title: 'Selecione apenas um perfil de usuário',
          placement: 'top',
          bgColor: 'red.500',
        });
        return;
      }

      if (!isClient && !isPartner) {
        setIsLoading(false);
        toast.show({
          title: 'Selecione um perfil de usuário',
          placement: 'top',
          bgColor: 'red.500',
        });
        return;
      }

      const localDate = date.split('/');
      const serverDate = `${localDate[2]}-${localDate[1]}-${localDate[0]}`;

      await api.post('/user/new', {
        name,
        last_name: lastName,
        cpf,
        birth_date: serverDate,
        email,
        mobile_phone,
        genderId: selectedGender,
        username,
        password,
        isPartner: !isClient,
        isTermsAccepted: true,
      });

      await saveProfile({
        name,
        last_name: lastName,
        cpf,
        birth_date: new Date(date),
        phone: mobile_phone,
        genderId: Number(selectedGender),
      });

      setIsLoading(false);
      await signIn(email, password);
    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError ? error.message : 'Erro ao realizar cadastro';
      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500',
      });
    } finally {
      setIsLoading(false);
    }

    setIsLoading(false);
  }

  console.log(isClient, isPartner);

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      showsVerticalScrollIndicator={false}
    >
      <VStack px={5} py={5}>
        <VStack p={5} backgroundColor="white">
          <Center py={5}>
            <Heading fontSize="xlg" color="gray.800">
              Registre-se gratuitamente
            </Heading>
          </Center>

          <VStack>
            <Center>
              <Text color="gray.500" fontFamily={'body'} fontSize="md" pb={5}>
                Qual o seu tipo de perfil?
              </Text>
            </Center>
            <HStack justifyContent={'space-around'} mb={3}>
              <VStack
                p={3}
                borderWidth={2}
                backgroundColor={isClient ? 'purple.600' : 'transparent'}
                borderRadius={15}
              >
                <TouchableOpacity onPress={handleToggleButton}>
                  <Text bold color={isClient ? 'white' : 'gray.400'}>
                    Sou um cliente
                  </Text>
                </TouchableOpacity>
              </VStack>

              <VStack
                p={3}
                borderWidth={2}
                backgroundColor={isPartner ? 'purple.600' : 'transparent'}
                borderRadius={15}
              >
                <TouchableOpacity onPress={handleToggleButton}>
                  <Text bold color={isPartner ? 'white' : 'gray.400'}>
                    Sou um parceiro
                  </Text>
                </TouchableOpacity>
              </VStack>
            </HStack>
          </VStack>

          <Center>
            <Text
              color="gray.500"
              pt={5}
              fontFamily={'body'}
              fontSize="md"
              pb={5}
            >
              Seus dados pessoais
            </Text>
            <Controller
              control={control}
              name="name"
              render={({ field: { onChange, value } }) => (
                <Input
                  placeholder="Nome"
                  autoCapitalize="none"
                  keyboardType="default"
                  onChangeText={onChange}
                  value={value}
                  errorMessage={errors.name?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="lastName"
              render={({ field: { onChange, value } }) => (
                <Input
                  placeholder="Sobrenome"
                  autoCapitalize="none"
                  onChangeText={onChange}
                  keyboardType="default"
                  value={value}
                  errorMessage={errors.lastName?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="cpf"
              render={({ field: { onChange, value } }) => (
                <Input
                  placeholder="CPF"
                  keyboardType="numeric"
                  autoCapitalize="none"
                  onChangeText={onChange}
                  value={value}
                  errorMessage={errors.cpf?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="mobile_phone"
              render={({ field: { onChange, value } }) => (
                <Input
                  placeholder="Telefone"
                  keyboardType="numeric"
                  onChangeText={onChange}
                  value={value}
                  errorMessage={errors.mobile_phone?.message}
                />
              )}
            />

            <Select
              fontSize="md"
              width={'full'}
              mb={5}
              data={allGenders.map((item) => {
                return { label: item.name, value: item.id };
              })}
              label={
                selectedGender
                  ? allGenders.find((item) => item.id === selectedGender)?.name
                  : 'Gênero'
              }
              onValueChange={(value) => setSelectedGender(Number(value))}
              key={allGenders.find((item) => item.id === selectedGender)?.id}
            />

            <Input
              placeholder="Data de nascimento"
              editable={false}
              value={date}
              caretHidden
              onPressIn={() => {
                DateTimePickerAndroid.open({
                  mode: 'date',
                  value: new Date(),
                  onChange: (event, date) => handleDate(date as Date),
                });
              }}
            />

            <Text mb={5} fontFamily="body" fontSize="md">
              Seus dados de acesso
            </Text>

            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, value } }) => (
                <Input
                  placeholder="E-mail"
                  autoCapitalize="none"
                  onChangeText={onChange}
                  value={value}
                  errorMessage={errors.email?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="username"
              render={({ field: { onChange, value } }) => (
                <Input
                  placeholder="Nome de Usuário"
                  autoCapitalize="none"
                  onChangeText={onChange}
                  value={value}
                  errorMessage={errors.username?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, value } }) => (
                <Input
                  placeholder="Senha"
                  autoCapitalize="none"
                  secureTextEntry
                  onChangeText={onChange}
                  value={value}
                  errorMessage={errors.password?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="confirmPassword"
              render={({ field: { onChange, value } }) => (
                <Input
                  placeholder="Confirmar senha"
                  autoCapitalize="none"
                  secureTextEntry
                  onChangeText={onChange}
                  value={value}
                  errorMessage={errors.confirmPassword?.message}
                />
              )}
            />

            <VStack>
              <Text
                color="gray.400"
                fontFamily="body"
                fontSize="sm"
                textAlign="justify"
              >
                Ao prosseguir você concorda com os termos e condições de uso do
                aplicativo que estão disponíveis abaixo.
              </Text>

              <TouchableOpacity onPress={() => navigation.navigate('terms')}>
                <Text fontWeight="bold" textAlign="center">
                  Termos e condições de uso
                </Text>
              </TouchableOpacity>
            </VStack>

            <Button
              title="Cadastrar"
              onPress={handleSubmit(handleSignClientSignUp)}
              isLoading={isLoading}
              mt={5}
            />

            <Button
              title="Voltar"
              variant={'outline'}
              onPress={handleGoBack}
              mt={3}
            />
          </Center>
        </VStack>
      </VStack>
    </ScrollView>
  );
}
