import { Feather } from '@expo/vector-icons';
import { Select as SelectNative, ISelectProps, Icon } from 'native-base';

type Props = ISelectProps & {
  label: string | undefined;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
};

export function Select({ label, data, ...rest }: Props) {
  return (
    <SelectNative
      accessibilityLabel={label}
      placeholder={label}
      borderWidth={1}
      color="gray.100"
      fontFamily={'body'}
      placeholderTextColor="gray.500"
      dropdownIcon={<Icon as={Feather} name="chevron-down" size={5} mr={5} />}
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
