import { Button } from '@components/Button';
import { Input } from '@components/Input';
import { api } from '@services/api';
import { VStack, Text, useToast } from 'native-base';
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

export function RecoverPassword() {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');

  const [pages, setPages] = useState(0);

  const toast = useToast();

  async function sendEmail() {
    try {
      await api.post('/passwords/forgot', {
        email,
      });

      setPages(1);
    } catch (error) {
      throw new Error('Erro ao enviar e-mail');
    }
  }

  async function verifyCode() {
    try {
      const response = await api.post(`/passwords/verify/${email}`, {
        code,
      });

      if (response.status === 200) {
        setPages(2);
      } else {
        toast.show({
          title: 'Código inválido',
          placement: 'top',
          bgColor: 'red.500',
        });
      }
    } catch (error) {
      throw new Error('Erro ao verificar código');
    }
  }

  return (
    <SafeAreaView>
      {pages === 0 && (
        <VStack px={5} py={100}>
          <VStack backgroundColor={'white'} p={5} borderRadius={10}>
            <Text fontSize={'md'} textAlign={'justify'}>
              Insira o endereço de e-mail que você utilizou no momento em que se
              cadastrou na plataforma.
            </Text>
            <Input
              placeholder="E-mail"
              mt={3}
              value={email}
              onChangeText={setEmail}
            />
            <Button title="Enviar" mt={3} onPress={sendEmail} />
          </VStack>
        </VStack>
      )}

      {pages === 1 && (
        <VStack px={5} py={100}>
          <VStack backgroundColor={'white'} p={5} borderRadius={10}>
            <Text fontSize={'md'}>
              Insira o código que você recebeu em seu e-mail
            </Text>
            <Input
              placeholder="Ex: Adjxa98ajc"
              mt={3}
              value={code}
              onChangeText={setCode}
            />
            <Button title="Validar" mt={3} onPress={verifyCode} />
          </VStack>
        </VStack>
      )}

      {pages === 2 && (
        <VStack px={5} py={100}>
          <VStack backgroundColor={'white'} p={5} borderRadius={10}>
            <Input
              placeholder="Nova senha"
              mt={3}
              value={code}
              onChangeText={setCode}
            />
            <Input
              placeholder="Confirmar nova senha"
              mt={3}
              value={code}
              onChangeText={setCode}
            />
            <Button title="Tudo certo" mt={3} onPress={verifyCode} />
          </VStack>
        </VStack>
      )}
    </SafeAreaView>
  );
}
