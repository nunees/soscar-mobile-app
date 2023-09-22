import { AppHeader } from '@components/AppHeader';
import { Button } from '@components/Button';
import { Input } from '@components/Input';
import { LoadingModal } from '@components/LoadingModal';
import { SelectCar } from '@components/SelectCar';
import { TextArea } from '@components/TextArea';
import { IBrandDTO } from '@dtos/IBrandDTO';
import { IInsuranceDTO } from '@dtos/IInsuranceDTO';
import { IModelDTO } from '@dtos/IModelDTO';
import { useAuth } from '@hooks/useAuth';
import { useNavigation } from '@react-navigation/native';
import { AppNavigatorRoutesProps } from '@routes/app.routes';
import { api } from '@services/api';
import { AppError } from '@utils/AppError';
import { VStack, ScrollView, useToast, Checkbox, Text } from 'native-base';
import { useEffect, useState } from 'react';

const vehiclesColors = [
  'Amarelo',
  'Azul',
  'Branco',
  'Cinza',
  'Dourado',
  'Laranja',
  'Marrom',
  'Prata',
  'Preto',
  'Rosa',
  'Roxo',
  'Verde',
  'Vermelho',
  'Vinho',
  'Outra',
];

export function AddVehicle() {
  const [showModal, setShowModal] = useState(false);
  const [brands, setBrands] = useState<IBrandDTO[]>([{}] as IBrandDTO[]);
  const [models, setModels] = useState<IModelDTO[]>([{}] as IModelDTO[]);
  const [insurances, setInsurances] = useState<IInsuranceDTO[]>([
    {},
  ] as IInsuranceDTO[]);

  const [model, setModel] = useState(0);
  const [brand, setBrand] = useState(0);

  const [year, setYear] = useState('');
  const [plate, setPlate] = useState('');
  const [color, setColor] = useState('');
  const [notes, setNotes] = useState('');

  const [insuranceId, setInsuranceId] = useState(0);
  const [isMainVehicle, setIsMainVehicle] = useState(false);

  const [toggleInsurance, setToggleInsurance] = useState(false);

  const [loadMessage, setLoadMessage] = useState('');

  const navigation = useNavigation<AppNavigatorRoutesProps>();
  const toast = useToast();

  const { user } = useAuth();

  async function getAllBrands() {
    try {
      const response = await api.get('/vehicles/brands');

      setBrands(response.data);
    } catch (error) {
      const isAppError = error instanceof AppError;
      toast.show({
        title: isAppError
          ? error.message
          : 'Ocorreu um erro ao obter a lista de montadoras',
        placement: 'top',
        bgColor: 'red.500',
      });
    }
  }

  async function fetchAllModels(value: string) {
    setLoadMessage('Buscando modelos');
    setShowModal(true);
    const response = await api.get(`/vehicles/names/${value}`);
    setModels(response.data);
    setBrand(Number(value));
    setShowModal(false);
  }

  async function getAllInsurances() {
    setLoadMessage('Buscando seguradoras');
    const response = await api.get('/vehicles/insurances/all');
    setInsurances(response.data);
  }

  async function handleAddVehicle() {
    try {
      setShowModal(true);

      await api.post(
        '/vehicles',
        {
          brand_id: Number(brand),
          name_id: Number(model),
          color,
          year: Number(year),
          plate,
          notes,
          insurance_id: Number(insuranceId) || 12,
          isPrimary: isMainVehicle,
        },
        {
          headers: {
            id: user.id,
          },
        }
      );

      setShowModal(false);
      navigation.navigate('vehicles');
    } catch (error) {
      setShowModal(false);
      const isApperror = error instanceof AppError;
      const title = isApperror
        ? error.message
        : 'Ocorreu um erro ao adicionar o veículo';
      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500',
      });
    } finally {
      setShowModal(false);
    }
  }

  useEffect(() => {
    getAllBrands();
    getAllInsurances();
  }, []);

  return (
    <VStack>
      <VStack>
        <AppHeader title="Adicionar Veículo" />
      </VStack>

      <VStack px={5} py={5}>
        {showModal && (
          <LoadingModal
            showModal={showModal}
            setShowModal={setShowModal}
            message={loadMessage}
          />
        )}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 120 }}
        >
          <VStack>
            <VStack backgroundColor="white" p={5} borderRadius={10} mb={5}>
              <Text color="gray.400" bold pb={2}>
                Selecione a montadora
              </Text>
              <SelectCar
                data={brands.map((brand) => {
                  return {
                    label: brand.name,
                    value: brand.id,
                  };
                })}
                label={'Montadora'}
                onValueChange={(value) => fetchAllModels(value)}
              />
            </VStack>

            <VStack backgroundColor="white" p={5} borderRadius={10} mb={5}>
              <Text color="gray.400" bold pb={2}>
                Selecione o modelo do veículo
              </Text>
              <SelectCar
                data={
                  models
                    ? models.map((model) => {
                        return {
                          label: model.name,
                          value: model.id,
                        };
                      })
                    : []
                }
                label={'Modelo'}
                onValueChange={(value) => setModel(Number(value))}
              />
            </VStack>

            <VStack backgroundColor="white" p={5} borderRadius={10} mb={5}>
              <Text color="gray.400" bold pb={2}>
                Selecione o ano do veículo (Ex: 2021)
              </Text>
              <Input
                placeholder="Ano"
                value={year}
                onChangeText={setYear}
                keyboardType="numeric"
              />
            </VStack>

            <VStack backgroundColor="white" p={5} borderRadius={10} mb={5}>
              <Text color="gray.400" bold pb={2}>
                Selecione a cor do veículo
              </Text>
              <SelectCar
                data={vehiclesColors.map((color) => {
                  return {
                    label: color,
                    value: color,
                  };
                })}
                label={'Cor'}
                onValueChange={(value) => setColor(value)}
              />
            </VStack>

            <VStack backgroundColor="white" p={5} borderRadius={10} mb={5}>
              <Checkbox
                colorScheme="purple"
                value={''}
                onChange={() => setToggleInsurance(!toggleInsurance)}
                mb={3}
              >
                <Text>Meu veículo é segurado</Text>
              </Checkbox>

              {toggleInsurance && (
                <SelectCar
                  data={
                    insurances
                      ? insurances.map((insurance) => {
                          return {
                            label: insurance.name,
                            value: insurance.id,
                          };
                        })
                      : []
                  }
                  label={'Seguradora'}
                  onValueChange={(value) => setInsuranceId(Number(value))}
                />
              )}
            </VStack>

            <VStack backgroundColor="white" p={5} borderRadius={10} mb={5}>
              <TextArea
                placeholder="Observações"
                value={notes}
                onChangeText={setNotes}
              />
            </VStack>

            <VStack backgroundColor="white" p={5} borderRadius={10} mb={5}>
              <Checkbox
                colorScheme="purple"
                value={'mainVehicle'}
                onChange={() => setIsMainVehicle(!isMainVehicle)}
              >
                <Text color="gray.400" bold>
                  Definir como veículo padrão
                </Text>
              </Checkbox>
            </VStack>
          </VStack>
          <Button onPress={handleAddVehicle} title={'Salvar'} mt={20} />
        </ScrollView>
      </VStack>
    </VStack>
  );
}
