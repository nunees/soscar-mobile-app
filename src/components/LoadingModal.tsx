import {
  HStack,
  Heading,
  IModalProps,
  Modal,
  Spinner,
  VStack,
  Text,
} from "native-base";
import { useState } from "react";

type Props = IModalProps & {
  showModal: boolean;
  setShowModal: (value: boolean) => void;
};

export function LoadingModal({ showModal, setShowModal, ...rest }: Props) {
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
            <Text>Aguarde...</Text>
          </VStack>
        </Modal.Body>
      </Modal.Content>
    </Modal>
  );
}
