import { AppHeader } from '@components/AppHeader';
import { Button } from '@components/Button';
import { Input } from '@components/Input';
import { LoadingModal } from '@components/LoadingModal';
import { useAuth } from '@hooks/useAuth';
import { useNavigation } from '@react-navigation/native';
import { AppNavigatorRoutesProps } from '@routes/app.routes';
import { api } from '@services/api';
import { AppError } from '@utils/AppError';
import { VStack, Text, useToast } from 'native-base';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

type FormDataProps = {
  oldPassword: string;
  password: string;
  confirm_password: string;
};

export function ChangePassword() {
  const [isLoading, setIsLoading] = useState(false);

  const { user } = useAuth();

  const toast = useToast();

  const navigation = useNavigation<AppNavigatorRoutesProps>();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormDataProps>();

  async function handleSubmitForm(data: FormDataProps) {
    setIsLoading(true);
    try {
      await api.put(
        '/user/password/update',
        {
          old_password: data.oldPassword,
          password: data.password,
        },
        {
          headers: {
            id: user.id,
          },
        }
      );
      toast.show({
        title: 'Senha alterada com sucesso!',
        placement: 'top',
        bgColor: 'green.500',
      });
      setIsLoading(false);
      navigation.navigate('home');
    } catch (error) {
      setIsLoading(false);
      const isAppError = error instanceof AppError;
      toast.show({
        title: isAppError ? error.message : 'Erro ao obter dados',
        placement: 'top',
        bgColor: 'red.500',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <VStack>
      <VStack>
        <AppHeader
          title="Alterar senha"
          navigation={navigation}
          screen="profile"
        />
      </VStack>

      <VStack px={10} py={10}>
        <Text bold fontSize="xs">
          Senha Atual
        </Text>
        <Controller
          control={control}
          name="oldPassword"
          render={({ field: { value, onChange } }) => (
            <Input
              placeholder="Digite sua senha atual"
              onChangeText={onChange}
              secureTextEntry
              value={value}
              errorMessage={errors.oldPassword?.message}
            />
          )}
        />

        <Text bold fontSize="xs">
          Nova senha
        </Text>
        <Controller
          control={control}
          name="password"
          render={({ field: { value, onChange } }) => (
            <Input
              placeholder="Digite sua nova senha"
              onChangeText={onChange}
              value={value}
              secureTextEntry
              errorMessage={errors.password?.message}
            />
          )}
        />

        <Text bold fontSize="xs">
          Confirmar senha
        </Text>
        <Controller
          control={control}
          name="confirm_password"
          render={({ field: { value, onChange } }) => (
            <Input
              placeholder="Confirme sua nova senha"
              onChangeText={onChange}
              value={value}
              secureTextEntry
              errorMessage={errors.confirm_password?.message}
            />
          )}
        />

        <Button
          isLoading={isLoading}
          isLoadingText={'Atualizando...'}
          title="Atualizar informações"
          mt={10}
          onPress={handleSubmit(handleSubmitForm)}
        />
      </VStack>
    </VStack>
  );
}
