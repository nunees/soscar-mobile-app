import { Map } from '@components/Map';
import { Feather } from '@expo/vector-icons';
import { Pressable, VStack, Icon } from 'native-base';
// import { GOOGLE_MAPS_APIKEY } from '@env';
import React, { useState } from 'react';

export function Assistance() {
  const [showMapControls, setShowMapControls] = useState(false);

  return (
    <>
      <Map latitude={Number(-23.5505199)} longitude={Number(-46.6333094)} />
      {showMapControls && (
        <Pressable
          w={50}
          h={50}
          borderRadius={50}
          backgroundColor="white"
          shadow={1}
          position="absolute"
          right={5}
          bottom={100}
          alignItems="center"
          justifyContent="center"
          onPress={() => console.log('oi')}
        >
          <Icon name={'compass'} as={Feather} size={10} />
        </Pressable>
      )}
    </>
  );
}
