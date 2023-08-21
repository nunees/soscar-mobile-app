import { AppHeader } from "@components/AppHeader";
import { VStack, ScrollView, useToast } from "native-base";
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

  const [model, setModel] = useState(0);
  const [brand, setBrand] = useState(0);

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

  function handleSelectCar(value: string) {
    setModel(Number(value));

    console.log("", model);
    console.log(brand);
  }

  useEffect(() => {
    getAllBrands();
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
              onValueChange={(value) => handleSelectCar(value)}
            />

            <Input placeholder="Ano" />
            <Input placeholder="Placa" />
            <Input placeholder="Cor" />
            <TextArea placeholder="Observações" />
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
