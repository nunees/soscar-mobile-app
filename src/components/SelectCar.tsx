import { Select as SelectNative, ISelectProps, FormControl } from "native-base";
import { useState } from "react";
import { ModelDTO } from "@dtos/ModelDTO";
import { BrandDTO } from "@dtos/BrandDTO";
import { AnyObjectSchema } from "yup";

type Props = ISelectProps & {
  label: string;
  errorMessage?: string;
  data: any;
};

export function SelectCar({ label, data, errorMessage, ...rest }: Props) {
  return (
    <SelectNative
      mb={3}
      minWidth={"full"}
      accessibilityLabel={label}
      placeholder={label}
      borderWidth={2}
      fontSize="md"
      color="gray.100"
      fontFamily={"body"}
      placeholderTextColor="gray.400"
      {...rest}
    >
      {data.map((item: any) => (
        <SelectNative.Item
          key={item.id}
          label={item.label}
          value={item.value}
        />
      ))}
    </SelectNative>
  );
}
