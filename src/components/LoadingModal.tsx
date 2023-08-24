import { IModalProps, Modal, Spinner, VStack, Text } from "native-base";

type Props = IModalProps & {
  message?: string | undefined;
  showModal: boolean;
  setShowModal: (value: boolean) => void;
};

export function LoadingModal({
  showModal,
  setShowModal,
  message,
  ...rest
}: Props) {
  return (
    <Modal isOpen={showModal} onClose={() => setShowModal(false)} {...rest}>
      <Modal.Content maxWidth="400px">
        <Modal.Body>
          <VStack alignItems="center">
            <Spinner
              color="orange.500"
              accessibilityLabel="Aguarde..."
              size={50}
            />
            <Text>{message}</Text>
          </VStack>
        </Modal.Body>
      </Modal.Content>
    </Modal>
  );
}
