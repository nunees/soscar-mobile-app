import { Input } from '@components/Input';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { AppNavigatorRoutesProps } from '@routes/app.routes';
import { VStack, Icon, FlatList, Text, Pressable } from 'native-base';
import { useState } from 'react';
import { TouchableOpacity } from 'react-native';

const queryStrings = [
  'pilhas',
  'eletrônicos',
  'eletronicos',
  'baterias',
  'lampada',
  'lâmpadas',
  'óleo de cozinha',
  'oleo de cozinha',
  'vidros',
  'vidro',
  'embalagens',
  'plasticos',
  'plásticos',
  'metais',
  'metal',
  'ferros',
  'ferro',
  'aluminio',
  'alumínio',
  'aluminios',
  'alumínios',
  'latas',
  'lata',
  'lixo',
  'lixo eletrônico',
  'lixo eletronico',
  'pilha',
  'papel',
  'papeis',
  'papelão',
  'papelao',
  'papelões',
  'papeloes',
  'garrafas',
  'garrafa',
  'garrafas pet',
  'celular',
  'celulares',
  'computador',
  'computadores',
  'entulho',
  'entulhos',
  'entulhos de construção',
  'entulho de construção',
];

export function SearchBar() {
  // const [search, setSearch] = useState('');
  // const { searchUser } = useSearch();

  // const handleSearch = useCallback(async () => {
  //   searchUser(search);
  // }, [search]);

  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>(queryStrings);

  // const navigation = useNavigation<AppNavigatorRoutesProps>();

  function handleSearch(query: string) {
    setQuery(query);

    if (query.length >= 1) {
      const filteredQuery = queryStrings.filter((item) =>
        item.includes(query.toLowerCase())
      );

      setSuggestions(filteredQuery);
    } else {
      setSuggestions([]);
    }
  }

  return (
    <VStack w={'full'}>
      <Input
        h={50}
        borderRadius={6}
        fontSize={'md'}
        placeholder="O que deseja fazer?"
        rightElement={
          query.length > 0 ? (
            <Icon
              as={Feather}
              name="x"
              size="md"
              m={2}
              color="muted.400"
              onPress={() => setQuery('')}
            />
          ) : (
            <Icon
              as={Feather}
              name="search"
              size="md"
              m={2}
              color="muted.400"
            />
          )
        }
        _focus={{
          borderColor: 'purple.400',
          borderWidth: 2,
        }}
        value={query}
        onChangeText={handleSearch}
        backgroundColor={'white'}
      />
      {query.length > 0 && (
        <FlatList
          data={suggestions}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <Pressable
              bg={'white'}
              p={3}
              _pressed={{
                bg: 'gray.100',
              }}
              onPress={() => null}
            >
              <Text color="gray.400">
                Quero descartar{' '}
                <Text bold color="gray.900">
                  {item}
                </Text>
              </Text>
            </Pressable>
          )}
        />
      )}
    </VStack>
  );
}
