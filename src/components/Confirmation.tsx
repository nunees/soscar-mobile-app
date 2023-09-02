import { AlertDialog, Button, Center, VStack } from 'native-base';
import { useRef, useState } from 'react';

type Props = {
  title: string;
  body: string;
  btnConfirmText: string;
  btnCancelText: string;

  onConfirm(): (locationId: string) => Promise<void>;
  onCancel: () => void;
};

export function Confirmation({
  title,
  body,
  btnCancelText,
  btnConfirmText,
  onConfirm,
  onCancel,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);

  const onClose = () => setIsOpen(false);

  const cancelRef = useRef(null);
  return (
    <VStack>
      <Center>
        <AlertDialog
          leastDestructiveRef={cancelRef}
          isOpen={isOpen}
          onClose={onClose}
        >
          <AlertDialog.Content>
            <AlertDialog.CloseButton />
            <AlertDialog.Header>{title}</AlertDialog.Header>
            <AlertDialog.Body>{body}</AlertDialog.Body>
            <AlertDialog.Footer>
              <Button.Group space={2}>
                <Button
                  variant="unstyled"
                  colorScheme="coolGray"
                  onPress={onCancel}
                  ref={cancelRef}
                >
                  {btnCancelText}
                </Button>
                <Button colorScheme="danger" onPress={onConfirm}>
                  {btnConfirmText}
                </Button>
              </Button.Group>
            </AlertDialog.Footer>
          </AlertDialog.Content>
        </AlertDialog>
      </Center>
    </VStack>
  );
}
