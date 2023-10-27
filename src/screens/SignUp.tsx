/* eslint-disable import/no-extraneous-dependencies */
import AvatarSVG from '@assets/avatar.svg';
import { Button } from '@components/Button';
import { Input } from '@components/Input';
import { Select } from '@components/Select';
import { yupResolver } from '@hookform/resolvers/yup';
import { useAuth } from '@hooks/useAuth';
import { useDateFormater } from '@hooks/useDateFormater';
import { useIdGenerator } from '@hooks/useIdGenerator';
import { useProfile } from '@hooks/useProfile';
import { useUploadImage } from '@hooks/useUploadImage';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import { AuthNavigatorRoutesProps } from '@routes/auth.routes';
import { api } from '@services/api';
import { AppError } from '@utils/AppError';
import {
  ScrollView,
  VStack,
  Text,
  Center,
  useToast,
  Avatar,
  Pressable,
  Icon,
  Skeleton,
} from 'native-base';
import {
  PencilSimpleLine,
  Eye,
  EyeClosed,
  Calendar,
} from 'phosphor-react-native';
import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { SafeAreaView } from 'react-native-safe-area-context';
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
  const [isPhotoLoading, setIsPhotoLoading] = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [userPhoto, setUserPhoto] = useState<any>('');
  const [userPhotoUploadForm, setUserPhotoUploadForm] = useState<
    FormData | undefined
  >({} as FormData);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [allGenders] = useState(genders);
  const [selectedGender, setSelectedGender] = useState(0);

  const [date, setDate] = useState<string>('');

  const [isPartner, setIsPartner] = useState(false);

  const { signIn } = useAuth();
  const { saveProfile } = useProfile();
  const { handleUserProfilePictureSelect } = useUploadImage();
  const { generateId } = useIdGenerator();
  const { formatDate } = useDateFormater();

  const toast = useToast();
  const navigation = useNavigation<AuthNavigatorRoutesProps>();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormDataProps>({
    resolver: yupResolver(registrationSchema),
  });

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

      const localDate = date.split('/');
      const serverDate = `${localDate[2]}-${localDate[1]}-${localDate[0]}`;

      const response = await api.post('/user/new', {
        name,
        last_name: lastName,
        cpf,
        birth_date: serverDate,
        email,
        mobile_phone,
        genderId: selectedGender,
        username,
        password,
        isPartner: !!isPartner,
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
    <SafeAreaView>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 50 }}
        showsVerticalScrollIndicator={false}
      >
        <VStack borderBottomRadius={10} bg={'white'} pb={10}>
          <Center mt={5} px={10}>
            <Text bold fontFamily={'body'} fontSize={'lg'}>
              Boas vindas
            </Text>
            <Text fontSize={'sm'} color={'gray.700'} textAlign={'center'}>
              Crie sua conta e encontre os melhores serviços
            </Text>
          </Center>

          <Center mt={3} px={10}>
            <Select
              fontSize="md"
              width={'full'}
              mb={5}
              placeholder="Qual o seu tipo de usuário?"
              data={['Cliente', 'Parceiro'].map((item, index) => {
                return { label: item, value: index };
              })}
              label={isPartner ? 'Parceiro' : 'Cliente'}
              onValueChange={(value) => setIsPartner(!!value)}
              key={isPartner ? 'Parceiro' : 'Cliente'}
            />

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
              selectTextOnFocus={false}
              showSoftInputOnFocus={false}
              InputRightElement={
                <Pressable
                  onPress={() => {
                    DateTimePickerAndroid.open({
                      mode: 'date',
                      value: new Date(),
                      onChange: (event, date) =>
                        setDate(formatDate(date as Date)),
                    });
                  }}
                >
                  <Icon as={<Calendar />} size={20} color={'gray.400'} mr={2} />
                </Pressable>
              }
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
                  placeholder={'Senha'}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
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

            <Controller
              control={control}
              name="confirmPassword"
              render={({ field: { onChange, value } }) => (
                <Input
                  placeholder="Confirmar senha"
                  autoCapitalize="none"
                  secureTextEntry={!showConfirmPassword}
                  onChangeText={onChange}
                  value={value}
                  InputRightElement={
                    <Pressable
                      onPress={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      <Icon
                        as={showConfirmPassword ? <Eye /> : <EyeClosed />}
                        size={20}
                        color={'gray.400'}
                        mr={2}
                      />
                    </Pressable>
                  }
                  errorMessage={errors.confirmPassword?.message}
                />
              )}
            />

            <VStack mb={5}>
              <Text
                color="gray.400"
                fontFamily="body"
                fontSize="sm"
                textAlign="center"
              >
                Ao prosseguir você concorda com os termos e condições de uso do
                aplicativo.
              </Text>
            </VStack>

            <Button
              variant={'dark'}
              title="Criar conta"
              onPress={handleSubmit(handleSignClientSignUp)}
              isLoading={isLoading}
            />
          </Center>
        </VStack>

        <VStack px={10}>
          <Center mt={50}>
            <Text fontSize={'md'} color="gray.600" pb={3}>
              Já tem uma conta?
            </Text>
            <Button
              variant={'light'}
              title={'Fazer login'}
              onPress={() => navigation.goBack()}
            />
          </Center>
        </VStack>
      </ScrollView>
    </SafeAreaView>
  );
}
