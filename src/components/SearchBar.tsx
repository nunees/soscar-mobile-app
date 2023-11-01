/* eslint-disable @typescript-eslint/no-explicit-any */
import { Input } from '@components/Input';
import { Feather } from '@expo/vector-icons';
import { VStack, Icon, FlatList, Text, Pressable } from 'native-base';
import { useState } from 'react';

const queryStrings = ['orçamento', 'agendamento', 'orçamento jurídico'];

type Props = {
  navigation: any;
};

export function SearchBar({ navigation }: Props) {
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

    if (query.length >= 3) {
      const filteredQuery = queryStrings.filter((item) =>
        item.includes(query.toLowerCase())
      );

      setSuggestions(filteredQuery);
    } else {
      setSuggestions([]);
    }
  }

  function handleNavigateToService() {
    switch (query) {
      case 'orçamento':
        navigation.navigate('schedule');
        break;
      case 'agendamento':
        navigation.navigate('quotes');
        break;
      case 'orçamento jurídico':
        navigation.navigate('legalQuotes');
        break;
      default:
        break;
    }
  }

  return (
    <VStack w={'full'}>
      <Input
        h={50}
        borderRadius={6}
        fontSize={'md'}
        placeholder="O que procura?"
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
          keyExtractor={(item: any) => item}
          renderItem={({ item }) => (
            <Pressable
              bg={'white'}
              p={3}
              _pressed={{
                bg: 'gray.100',
              }}
              onPress={handleNavigateToService}
            >
              <Text color="gray.400">
                Quero fazer um{' '}
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
