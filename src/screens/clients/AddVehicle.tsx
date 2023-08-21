import { AppHeader } from "@components/AppHeader";
import { VStack, ScrollView, useToast, Checkbox, Text } from "native-base";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm, Controller, set } from "react-hook-form";
import { useNavigation } from "@react-navigation/native";
import { AppNavigatorRoutesProps } from "@routes/app.routes";
import { Input } from "@components/Input";
import { SelectCar } from "@components/SelectCar";
import { TextArea } from "@components/TextArea";
import { Button } from "@components/Button";
import { BrandDTO } from "@dtos/BrandDTO";
import { useEffect, useState } from "react";
import { api } from "@services/api";
import { ModelDTO } from "@dtos/ModelDTO";
import { all } from "axios";
import { AppError } from "@utils/AppError";
import { compareSpecificity } from "native-base/lib/typescript/hooks/useThemeProps/propsFlattener";

type FormDataProps = {
  brand: string;
  model: string;
  year: number;
  plate: string;
  color: string;
};

const loginSchema = yup.object().shape({
  brand: yup.string().required("Informe a marca do veículo"),
  model: yup.string().required("Informe o modelo do veículo"),
  year: yup.number().required("Informe o ano do veículo"),
  plate: yup.string().required("Informe a placa do veículo"),
  color: yup.string().required("Informe a cor do veículo"),
});

export function AddVehicle() {
  const [brands, setBrands] = useState<BrandDTO[]>([{}] as BrandDTO[]);
  const [models, setModels] = useState<ModelDTO[]>([{}] as ModelDTO[]);
  const [insurances, setInsurances] = useState<any[]>([{}] as any[]);

  const [model, setModel] = useState(0);
  const [brand, setBrand] = useState(0);

  const [year, setYear] = useState("");
  const [plate, setPlate] = useState("");
  const [color, setColor] = useState("");
  const [notes, setNotes] = useState("");

  const [insuranceId, setInsuranceId] = useState(0);
  const [isMainVehicle, setIsMainVehicle] = useState(false);

  const [toggleInsurance, setToggleInsurance] = useState(false);

  const navigation = useNavigation<AppNavigatorRoutesProps>();
  const toast = useToast();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormDataProps>({
    resolver: yupResolver(loginSchema),
  });

  async function getAllBrands() {
    try {
      const response = await api.get("/vehicles/brands");

      setBrands(response.data);
    } catch (error) {
      const isAppError = error instanceof AppError;
      toast.show({
        title: isAppError
          ? error.message
          : "Ocorreu um erro ao obter a lista de montadoras",
        placement: "top",
        bgColor: "red.500",
      });
    }
  }

  async function fetchAllModels(value: string) {
    const response = await api.get(`/vehicles/names/${value}`);
    setModels(response.data);
    setBrand(Number(value));
  }

  async function getAllInsurances() {
    const response = await api.get("/vehicles/insurances/all");
    setInsurances(response.data);
  }

  function handleSelectCar(value: string) {
    setModel(Number(value));
  }

  function handleAddVehicle(data: FormDataProps) {
    const response = api.post("/vehicles", {
      brand_id: Number(brand),
      model_id: Number(model),
      color,
      year: Number(year),
      plate,
      notes,
      insuranceId,
      isPrimary: isMainVehicle,
    });
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

      <VStack px={10} py={10}>
        <ScrollView>
          <VStack>
            <SelectCar
              data={brands.map((brand) => {
                return {
                  label: brand.name,
                  value: brand.id,
                };
              })}
              label={"Montadora"}
              onValueChange={(value) => fetchAllModels(value)}
            />

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
              label={"Modelo"}
              onValueChange={(value) => setModel(Number(value))}
            />

            <Input placeholder="Ano" value={year} onChangeText={setYear} />
            <Input placeholder="Placa" value={plate} onChangeText={setPlate} />
            <Input placeholder="Cor" value={color} onChangeText={setColor} />

            <Checkbox
              colorScheme="orange"
              value={""}
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
                label={"Seguradora"}
                onValueChange={(value) => setInsuranceId(Number(value))}
              />
            )}

            <TextArea
              placeholder="Observações"
              value={notes}
              onChangeText={setNotes}
            />

            <Checkbox
              colorScheme="orange"
              value={"OK"}
              onChange={() => setIsMainVehicle(!isMainVehicle)}
            >
              <Text color="gray.400" bold>
                Definir como veículo padrão
              </Text>
            </Checkbox>
          </VStack>
          <Button
            onPress={() => navigation.goBack()}
            title={"Salvar"}
            mt={20}
          />
        </ScrollView>
      </VStack>
    </VStack>
  );
}
