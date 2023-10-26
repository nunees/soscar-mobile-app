import { SERVICES_LIST } from '@data/ServicesList';
import { Select as SelectNative, ISelectProps } from 'native-base';

type Props = ISelectProps & {
  label: string;
  errorMessage?: string;
  categoryOfService: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
};

export function SelectBusinessCategories({
  label,
  categoryOfService,
  ...rest
}: Props) {
  return (
    <SelectNative
      h={14}
      px={4}
      borderRadius={10}
      fontSize="sm"
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
        // eslint-disable-next-line array-callback-return
        SERVICES_LIST.map((item) => {
          if (item.category_id === categoryOfService) {
            return (
              <SelectNative.Item
                key={item.id}
                label={item.name}
                value={String(item.id)}
              />
            );
          }
          return null;
        })
      }
    </SelectNative>
  );
}
