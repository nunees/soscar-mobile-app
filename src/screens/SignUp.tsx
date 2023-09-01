import ClientRideSVG from '@assets/driver-header.svg';
import MechanicHeaderSVG from '@assets/mechanic-header.svg';
import { Button } from '@components/Button';
import { Input } from '@components/Input';
import { LineDivider } from '@components/LineDivider';
import { Select } from '@components/Select';
import { yupResolver } from '@hookform/resolvers/yup';
import { useAuth } from '@hooks/useAuth';
import { useProfile } from '@hooks/useProfile';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import { AppNavigatorRoutesProps } from '@routes/app.routes';
import { api } from '@services/api';
import { AppError } from '@utils/AppError';
import {
  Heading,
  ScrollView,
  VStack,
  Text,
  Center,
  useToast,
  Checkbox,
} from 'native-base';
import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Alert, TouchableOpacity } from 'react-native';
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

  const [isTermsAccepted, setIsTermsAccepted] = useState(false);
  const [isPartner, setIsPartner] = useState(false);

  const [showForm, setShowForm] = useState(false);

  const toast = useToast();

  const navigation = useNavigation<AppNavigatorRoutesProps>();

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

  async function handleSignClientSignUp({
    name,
    lastName,
    cpf,
    email,
    username,
    password,
    mobile_phone,
  }: FormDataProps) {
    setIsLoading(true);

    if (!isTermsAccepted) {
      setIsLoading(false);
      Alert.alert(
        'Erro',
        'Você precisa aceitar os termos de uso para continuar'
      );
      return;
    }

    try {
      await api.post('/user/new', {
        name,
        last_name: lastName,
        cpf,
        birth_date: new Date(date),
        email,
        mobile_phone,
        genderId: Number(selectedGender),
        username,
        password,
        isPartner,
        isTermsAccepted,
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

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      showsVerticalScrollIndicator={false}
    >
      {!showForm && (
        <VStack px={10} py={60}>
          <VStack>
            <Center>
              <ClientRideSVG />
              <Button
                title={'Sou um Cliente'}
                onPress={() => {
                  setIsPartner(false);
                  setShowForm(true);
                }}
              />

              <LineDivider />
              <MechanicHeaderSVG width={450} height={300} />
              <Button
                title={'Sou um Parceiro'}
                onPress={() => {
                  setIsPartner(true);
                  setShowForm(true);
                }}
              />
            </Center>
          </VStack>
        </VStack>
      )}
      {showForm && (
        <VStack px={10} py={10}>
          <VStack mt={60}>
            <Center>
              <Heading fontSize="xlg" color="gray.100">
                Registrar-se
              </Heading>
              <Text
                color="gray.100"
                pt={5}
                fontFamily={'body'}
                fontSize="md"
                pb={5}
              >
                Precisamos de seus dados de acesso.
              </Text>

              <Controller
                control={control}
                name="name"
                render={({ field: { onChange, value } }) => (
                  <Input
                    placeholder="Nome"
                    autoCapitalize="none"
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
                    autoCapitalize="none"
                    keyboardType="numeric"
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

              <Select
                data={allGenders.map((item) => {
                  return { label: item.name, value: item.id };
                })}
                label={
                  selectedGender
                    ? allGenders.find((item) => item.id === selectedGender)
                        ?.name
                    : 'Gênero'
                }
                onValueChange={(value) => setSelectedGender(Number(value))}
                key={allGenders.find((item) => item.id === selectedGender)?.id}
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

              <Center px={5} mr={5}>
                <Checkbox
                  colorScheme="orange"
                  value="Concordo com os termos de uso"
                  accessibilityLabel="Lembrar-me"
                  onChange={() => setIsTermsAccepted(!isTermsAccepted)}
                  mt={5}
                >
                  <Text color="gray.100" fontSize="sm" textAlign="justify">
                    Ao prosseguir você concorda com os termos e condições de uso
                    do aplicativo que estão disponíveis abaixo.
                  </Text>
                </Checkbox>
                <TouchableOpacity>
                  <Text fontWeight="bold" textAlign="center">
                    Termos e condições de uso
                  </Text>
                </TouchableOpacity>
              </Center>

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
      )}
    </ScrollView>
  );
}
