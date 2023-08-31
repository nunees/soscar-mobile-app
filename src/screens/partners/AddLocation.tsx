import { AddPhoto } from '@components/AddPhoto';
import { AppHeader } from '@components/AppHeader';
import { Button } from '@components/Button';
import { Input } from '@components/Input';
import { LineDivider } from '@components/LineDivider';
import { TextArea } from '@components/TextArea';
import { ScrollView, VStack, Text, Checkbox } from 'native-base';

export function AddLocation() {
  return (
    <VStack flex={1}>
      <VStack>
        <AppHeader title="Adicionar Local" />
      </VStack>

      <VStack>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 120 }}
        >
          <VStack py={10} px={19}>
            <Input placeholder="CNPJ" />
            <Input placeholder="Nome Fantasia" />
            <Input placeholder="Telefone" />
            <Input placeholder="Email" />
            <Input placeholder="Endereço" />
            <Input placeholder="Número" />
            <Input placeholder="Bairro" />
            <Input placeholder="Cidade" />
            <Input placeholder="Estado" />
            <Input placeholder="CEP" />

            <VStack>
              <Text fontSize="md" pb={5} bold>
                Meios de pagamentos oferecidos
              </Text>
              <VStack flexGrow={1}>
                <Checkbox.Group flexDir={'row'} flexWrap="wrap">
                  <Checkbox value="dinheiro" mr={2} mb={5} colorScheme="orange">
                    <Text fontSize="md">Dinheiro</Text>
                  </Checkbox>
                  <Checkbox value="debito" ml={12} colorScheme="orange">
                    <Text fontSize="md">Débito</Text>
                  </Checkbox>
                  <Checkbox value="credito" ml={12} colorScheme="orange">
                    <Text fontSize="md">Crédito</Text>
                  </Checkbox>
                  <Checkbox value="transferencia" mr={2} colorScheme="orange">
                    <Text fontSize="md">Transferencia</Text>
                  </Checkbox>
                  <Checkbox value="outro" ml={1} colorScheme="orange">
                    <Text fontSize="md">PIX</Text>
                  </Checkbox>
                </Checkbox.Group>
              </VStack>
            </VStack>

            <LineDivider />

            <VStack>
              <Text fontSize="md" bold pb={2}>
                Tipos de serviços oferecidos
              </Text>
              <VStack flexGrow={1}>
                <Checkbox.Group>
                  <Checkbox value="1" mb={5}>
                    <Text fontSize="md">Acessorios</Text>
                  </Checkbox>
                  <Checkbox value="2" mb={5}>
                    <Text fontSize="md">Cambio</Text>
                  </Checkbox>
                  <Checkbox value="3" mb={5}>
                    <Text fontSize="md">Eletrica</Text>
                  </Checkbox>
                  <Checkbox value="4" mb={5}>
                    <Text fontSize="md">Fluidos</Text>
                  </Checkbox>
                  <Checkbox value="5" mb={5}>
                    <Text fontSize="md">Funilaria e Pintura</Text>
                  </Checkbox>
                  <Checkbox value="6" mb={5}>
                    <Text fontSize="md">Lavagem</Text>
                  </Checkbox>
                  <Checkbox value="7" mb={5}>
                    <Text fontSize="md">Mecanica</Text>
                  </Checkbox>
                  <Checkbox value="8" mb={5}>
                    <Text fontSize="md">Pneus</Text>
                  </Checkbox>
                  <Checkbox value="9" mb={5}>
                    <Text fontSize="md">Suspensão</Text>
                  </Checkbox>
                  <Checkbox value="10" mb={5}>
                    <Text fontSize="md">Vidros</Text>
                  </Checkbox>
                  <Checkbox value="11" mb={5}>
                    <Text fontSize="md">Outros</Text>
                  </Checkbox>
                </Checkbox.Group>
              </VStack>
            </VStack>

            <TextArea placeholder="Descricao do local" h={120} />

            <VStack>
              <Text fontSize="md" pb={5} bold>
                Adicione fotos do local
              </Text>
              <AddPhoto />
            </VStack>

            <Button title="Adicionar Local" mt={100} />
          </VStack>
        </ScrollView>
      </VStack>
    </VStack>
  );
}
