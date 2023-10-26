import { Select as SelectNative, ISelectProps } from 'native-base';

type Props = ISelectProps & {
  label: string | undefined;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
};

export function Select({ label, data, ...rest }: Props) {
  return (
    <SelectNative
      h={14}
      px={4}
      borderRadius={10}
      fontSize="sm"
      fontFamily={'body'}
      borderWidth={1}
      color="gray.400"
      _selectedItem={{
        color: 'gray.400',
      }}
      placeholderTextColor="gray.400"
      accessibilityLabel={label}
      placeholder={label}
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
