import {
  Button,
  createDisclosure,
  Menu,
  MenuContent,
  MenuItem,
  MenuTrigger,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalOverlay
} from '@hope-ui/solid';
import { HiOutlineDotsHorizontal } from 'solid-icons/hi';
import { BiSolidEdit } from 'solid-icons/bi';
import { HiOutlineTrash } from 'solid-icons/hi';
import { createSignal } from 'solid-js';
import { createSupabase } from 'solid-supabase';

export function CategoryPreferences(props: {
  categoryId: string;
  categoryTitle: string;
  onToggleEditText: (value: boolean) => void;
}) {
  const { isOpen, onOpen, onClose } = createDisclosure();

  const supabase = createSupabase();
  const [isLoading, setIsLoading] = createSignal(false);

  const handleDelete = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('category')
      .delete()
      .match({ id: props.categoryId }); 

    if (data) {
      setIsLoading(false);
      onClose();
    }
    if (error) console.log(error);
  };

  return (
    <>
      <Menu>
        <MenuTrigger
          as={HiOutlineDotsHorizontal}
          _active={{
            boxShadow: '$outline'
          }}
          _focus={{
            boxShadow: '$outline'
          }}
        >
          Edit
        </MenuTrigger>
        <MenuContent maxW={'$60'}>
          <MenuItem
            icon={<BiSolidEdit />}
            onSelect={() => props.onToggleEditText(true)}
          >
            Edit Title
          </MenuItem>
          <MenuItem
            colorScheme='danger'
            icon={<HiOutlineTrash />}
            disabled={isLoading()}
            onSelect={onOpen}
          >
            Delete category
          </MenuItem>
        </MenuContent>
      </Menu>

      <Modal centered opened={isOpen()} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalBody>
            Are you sure you want to delete "{props.categoryTitle}" ?
          </ModalBody>

          <ModalFooter gap='$4'>
            <Button onClick={onClose}>Cancel</Button>
            <Button
              colorScheme='danger'
              onClick={handleDelete}
              loading={isLoading()}
            >
              Confirm
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
