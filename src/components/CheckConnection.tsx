import { useNetInfo } from '@react-native-community/netinfo';
import { Alert, Slide, Text, VStack } from 'native-base';
import { memo, useState } from 'react';
import { TouchableOpacity } from 'react-native';

function CheckConnection() {
  const [isOpened, setIsOpened] = useState(false);
  const network = useNetInfo();
  const message = 'Verifique sua conexão com a internet';

  return (
    <VStack>
      {!network.isConnected && (
        <TouchableOpacity onPress={() => setIsOpened(!isOpened)}>
          <Slide in={isOpened} placement="top">
            <Alert justifyContent="center" status="error" safeAreaTop={8}>
              <Alert.Icon />
              <Text color="error.600" fontWeight="medium">
                {message}
              </Text>
            </Alert>
          </Slide>
        </TouchableOpacity>
      )}
    </VStack>
  );
}

export default memo(CheckConnection);
