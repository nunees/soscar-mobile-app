import { Select as SelectNative, ISelectProps, FormControl } from "native-base";
import { useState } from "react";
import { ModelDTO } from "@dtos/ModelDTO";
import { BrandDTO } from "@dtos/BrandDTO";

type Props = ISelectProps & {
  label: string;
  errorMessage?: string;
  data: [];
};

export function Select({ label, data, errorMessage, ...rest }: Props) {
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
      {data.map((item) => (
        <SelectNative.Item key={item} label={item} value={item} />
      ))}
    </SelectNative>
  );
}
