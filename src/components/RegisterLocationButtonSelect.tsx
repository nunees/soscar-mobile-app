import { FontAwesome5 } from '@expo/vector-icons';
import { useHandleState } from '@hooks/useHandleState';
import { HStack, Icon, Text, Pressable, FlatList } from 'native-base';
import React from 'react';

type Props = {
  items: { id: number; name: string; icon?: string }[];
  state: unknown[];
  saveText?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setState: React.Dispatch<React.SetStateAction<any[]>>;
};

function handleMultipleStateSelection(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  changeFunction: React.Dispatch<React.SetStateAction<any[]>>,
  state: unknown[],
  value: unknown
) {
  const alreadySelected = state.includes(value);

  if (alreadySelected === undefined) {
    changeFunction([value]);
    return;
  }
  if (!alreadySelected) {
    changeFunction([...state!, value]);
    return;
  }
  if (alreadySelected) {
    changeFunction(state?.filter((item) => item !== value));
  }
}

function RegisterLocationButtonSelect({
  items,
  state,
  setState,
  saveText,
}: Props) {
  return (
    <HStack flexWrap={'wrap'}>
      <FlatList
        data={items}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <Pressable
            onPress={
              !saveText
                ? () => handleMultipleStateSelection(setState, state, item.id)
                : () => handleMultipleStateSelection(setState, state, item.name)
            }
            key={item.id}
          >
            <HStack
              p={3}
              m={2}
              w={140}
              borderWidth={1}
              borderRadius={6}
              borderColor="purple.800"
              backgroundColor={
                state.includes(item.id) || state.includes(item.name)
                  ? 'purple.600'
                  : 'white'
              }
              justifyContent={'space-between'}
            >
              <Text
                color={
                  state.includes(item.id) || state.includes(item.name)
                    ? 'white'
                    : 'gray.400'
                }
                fontSize={'md'}
              >
                {item.name}
              </Text>

              {item.icon && (
                <Icon
                  as={FontAwesome5}
                  name={item.icon}
                  size={5}
                  ml={5}
                  color={state.includes(item.id) ? 'white' : 'gray.600'}
                />
              )}
            </HStack>
          </Pressable>
        )}
      />
    </HStack>
  );
}

export default RegisterLocationButtonSelect;
