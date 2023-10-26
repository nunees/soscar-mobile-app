/* eslint-disable no-restricted-syntax */

import { SERVICES_TYPES } from '@data/ServicesTypes';
import { FlatList, VStack } from 'native-base';
import { useState } from 'react';

import { Button } from './Button';

/* eslint-disable @typescript-eslint/no-explicit-any */

export function MultiSelection() {
  const [state, setState] = useState({
    selected: [] as any[],
    renderData: SERVICES_TYPES,
  });

  const onPressHandler = (id: number) => {
    const { selected } = state;
    console.log('Initial value of selected: ', selected);
    const renderData = [...state.renderData];

    const index = selected.findIndex((item) => item === id);
    if (index === -1) {
      selected.push(id);
    }

    console.log(selected);
  };

  return (
    <VStack>
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={state.renderData}
        renderItem={({ item }) => (
          <Button
            onPress={() => onPressHandler(item.id)}
            variant="outline"
            backgroundColor={
              state.selected.includes(item.id) ? 'purple.600' : 'white'
            }
            mx={2}
            my={1}
            w={100}
            h={50}
            title={item.name}
          />
        )}
      />
    </VStack>
  );
}
