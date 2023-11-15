import { AppHeader } from '@components/AppHeader';
import { IPushNotificationDTO } from '@dtos/IPushNotificationDTO';
import { Feather } from '@expo/vector-icons';
import { useAuth } from '@hooks/useAuth';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { AppNavigatorRoutesProps } from '@routes/app.routes';
import { PartnerNavigatorRoutesProps } from '@routes/partner.routes';
import { api } from '@services/api';
import { AppError } from '@utils/AppError';
import { FlatList, VStack, Text, HStack, Icon, useToast } from 'native-base';
import { useCallback, useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export function Notifications() {
  const [notifications, setNotifications] = useState<IPushNotificationDTO[]>(
    []
  );

  const toast = useToast();

  const { user } = useAuth();
  const navigation = user.isPartner
    ? useNavigation<PartnerNavigatorRoutesProps>()
    : useNavigation<AppNavigatorRoutesProps>();

  async function fetchNotifications() {
    try {
      const result = await api.get(`/notifications/all/new`, {
        headers: {
          id: user.id,
        },
      });

      setNotifications(result.data);
    } catch (error) {
      console.log(error);
    }
  }

  async function deleteNotification(id: string) {
    try {
      await api.delete(`/notifications/${id}`, {
        headers: {
          id: user.id,
        },
      });

      toast.show({
        title: 'Notificação deletada com sucesso',
        placement: 'top',
        bgColor: 'green.500',
      });
      fetchNotifications();
    } catch (error) {
      const isAppError = error instanceof AppError;
      const message = isAppError
        ? error.message
        : 'Erro ao deletar notificação';
      toast.show({
        title: message,
        placement: 'top',
        bgColor: 'red.500',
      });
    }
  }

  async function deleteAllNotifications() {}

  useFocusEffect(
    useCallback(() => {
      fetchNotifications();
    }, [])
  );

  const renderItem = (item: IPushNotificationDTO) => {
    return (
      <VStack px={5} py={1}>
        <HStack background={'white'} p={3} borderRadius={10}>
          <HStack alignItems={'center'}>
            <VStack w={300}>
              <Text fontSize={'md'} bold>
                {item.title}
              </Text>
              <Text fontSize={'md'}>{item.body}</Text>
              <Text fontSize={'xs'} bold>
                {item.created_at
                  ?.toString()
                  .split('T')[0]
                  .split('-')
                  .reverse()
                  .join('/')}{' '}
                ás {item.created_at?.toString().split('T')[1].split('.')[0]}
              </Text>
            </VStack>
            <VStack ml={5}>
              <TouchableOpacity onPress={() => deleteNotification(item.id)}>
                <Icon as={Feather} name="trash-2" size={5} color="gray.600" />
              </TouchableOpacity>
            </VStack>
          </HStack>
        </HStack>
      </VStack>
    );
  };

  const renderHeader = () => {
    return (
      <VStack px={5}>
        <HStack p={5} justifyContent={'space-between'}>
          <HStack>
            <Text>Total: {notifications.length}</Text>
          </HStack>
          <HStack>
            <TouchableOpacity onPress={() => deleteAllNotifications()}>
              <Text>Apagar tudo</Text>
            </TouchableOpacity>
          </HStack>
        </HStack>
      </VStack>
    );
  };

  const renderEmptyList = () => {
    return (
      <VStack px={5} py={1}>
        <HStack background={'white'} p={3} borderRadius={10}>
          <HStack alignItems={'center'}>
            <VStack w={280}>
              <Text bold>Nenhuma notificação</Text>
            </VStack>
          </HStack>
        </HStack>
      </VStack>
    );
  };

  return (
    <SafeAreaView>
      <VStack>
        <AppHeader
          title="Notificações"
          navigation={navigation}
          screen={'home'}
        />
      </VStack>

      <FlatList
        data={notifications}
        contentContainerStyle={{ paddingBottom: 100 }}
        ListHeaderComponent={() => renderHeader()}
        renderItem={({ item }) => renderItem(item)}
        ListEmptyComponent={() => renderEmptyList()}
      />
    </SafeAreaView>
  );
}
