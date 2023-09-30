import { Feather } from '@expo/vector-icons';
import { Select as SelectNative, ISelectProps, Icon } from 'native-base';

type Props = ISelectProps & {
  label: string;
  errorMessage?: string;
  categoryOfService: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
};

const serviceTypes = [
  // Acessórios
  { id: 1, category_id: 1, name: 'Calotas' },
  { id: 2, category_id: 1, name: 'Carregadores' },
  { id: 3, category_id: 1, name: 'Suportes' },
  { id: 4, category_id: 1, name: 'Outros' },

  // Câmbio
  { id: 5, category_id: 2, name: 'Retifica' },
  { id: 6, category_id: 2, name: 'Revisão' },
  { id: 7, category_id: 2, name: 'Troca de fluido' },
  { id: 8, category_id: 2, name: 'Outros' },

  // Elétrico
  { id: 9, category_id: 3, name: 'Bateria' },
  { id: 10, category_id: 3, name: 'Lâmpadas' },
  { id: 11, category_id: 3, name: 'Revisão' },
  { id: 12, category_id: 3, name: 'Vidros' },
  { id: 13, category_id: 3, name: 'Outros' },

  // Fluidos
  { id: 14, category_id: 4, name: 'Arrefecimento' },
  { id: 15, category_id: 4, name: 'Freio' },
  { id: 16, category_id: 4, name: 'Óleo' },
  { id: 17, category_id: 4, name: 'Outros' },

  // Funilaria e Pintura
  { id: 18, category_id: 5, name: 'Funilaria' },
  { id: 19, category_id: 5, name: 'Pintura' },
  { id: 20, category_id: 5, name: 'Outros' },

  // Lavagem
  { id: 21, category_id: 6, name: 'Completa' },
  { id: 22, category_id: 6, name: 'Simples' },
  { id: 23, category_id: 6, name: 'Outros' },

  // Mecânico
  { id: 24, category_id: 7, name: 'Alinhamento' },
  { id: 25, category_id: 7, name: 'Balanceamento' },
  { id: 26, category_id: 7, name: 'Correia dentada' },
  { id: 27, category_id: 7, name: 'Embreagem' },
  { id: 28, category_id: 7, name: 'Escapamento' },
  { id: 29, category_id: 7, name: 'Freio' },
  { id: 30, category_id: 7, name: 'Injeção eletrônica' },
  { id: 31, category_id: 7, name: 'Motor' },
  { id: 32, category_id: 7, name: 'Revisão' },
  { id: 33, category_id: 7, name: 'Suspensão' },
  { id: 34, category_id: 7, name: 'Outros' },

  // Pneus
  { id: 35, category_id: 8, name: 'Alinhamento' },
  { id: 36, category_id: 8, name: 'Balanceamento' },
  { id: 37, category_id: 8, name: 'Troca' },
  { id: 38, category_id: 8, name: 'Reparos' },
  { id: 39, category_id: 8, name: 'Outros' },

  // Suspensão
  { id: 40, category_id: 9, name: 'Amortecedor' },
  { id: 41, category_id: 9, name: 'Molas' },
  { id: 42, category_id: 9, name: 'Outros' },

  // Vidros
  { id: 43, category_id: 10, name: 'Reparo' },
  { id: 44, category_id: 10, name: 'Troca' },
  { id: 45, category_id: 10, name: 'Outros' },

  // Outros
  { id: 46, category_id: 11, name: 'Outros' },
];

export function SelectBusinessCategories({
  label,
  categoryOfService,
  ...rest
}: Props) {
  return (
    <SelectNative
      mb={3}
      minWidth={'full'}
      accessibilityLabel={label}
      placeholder={label}
      borderWidth={1}
      fontSize="md"
      color="gray.400"
      fontFamily={'body'}
      placeholderTextColor="gray.400"
      {...rest}
      dropdownIcon={<Icon as={Feather} name="chevron-down" size={5} mr={5} />}
    >
      {
        // eslint-disable-next-line array-callback-return
        serviceTypes.map((item) => {
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
