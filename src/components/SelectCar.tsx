import { Select as SelectNative, ISelectProps } from 'native-base';

type Props = ISelectProps & {
  label: string;
  errorMessage?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
};

export function SelectCar({ label, data, ...rest }: Props) {
  return (
    <SelectNative
      mb={3}
      borderTopWidth={0}
      borderLeftWidth={0}
      borderRightWidth={0}
      minWidth={'full'}
      accessibilityLabel={label}
      placeholder={label}
      borderWidth={2}
      fontSize="md"
      color="gray.100"
      fontFamily={'body'}
      placeholderTextColor="gray.400"
      {...rest}
    >
      {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data.map((item: any) => (
          <SelectNative.Item
            key={item.id}
            label={item.label}
            value={item.value}
          />
        ))
      }
    </SelectNative>
  );
}
