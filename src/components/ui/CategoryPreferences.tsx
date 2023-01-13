import {
  Button,
  createDisclosure,
  Heading,
  Menu,
  MenuContent,
  MenuItem,
  MenuTrigger,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text
} from '@hope-ui/solid';
import { HiOutlineDotsHorizontal } from 'solid-icons/hi';
import { BiSolidEdit } from 'solid-icons/bi';
import { HiOutlineLink } from 'solid-icons/hi';
import { HiOutlineTrash } from 'solid-icons/hi';
import { Accessor, createSignal, Show } from 'solid-js';
import { createSupabase } from 'solid-supabase';
import type { BookmarkList } from '../../types';

export function CategoryPreferences(props: {
  categoryId: number;
  categoryTitle: string;
  islinksEditing: Accessor<Boolean>;
  onToggleEditText: (value: boolean) => void;
  onToggleLinksEdit: (value: boolean) => void;
  links: BookmarkList;
}) {
  const { isOpen, onOpen, onClose } = createDisclosure();

  const supabase = createSupabase();
  const [isLoading, setIsLoading] = createSignal(false);

  const handleDelete = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('bookmarks')
      .delete()
      .match({ category_id: props.categoryId });

    if (data) {
      setIsLoading(false);
      onClose();
    }
    if (error) {
      onClose();
      console.log(error);
    }
  };

  const handleLinksToggle = () => {
    const menuTrigger = document.getElementById('categoryMenuTrigger')?.blur();

    document.getElementById('categoryMenuTrigger')?.blur();
    props.onToggleLinksEdit(!props.islinksEditing());
  };

  return (
    <>
      <Menu>
        <MenuTrigger
          id='categoryMenuTrigger'
          as={HiOutlineDotsHorizontal}
          _active={{
            boxShadow: '$outline'
          }}
          _focus={{
            boxShadow: '$outline'
          }}
        />

        <MenuContent maxW={'$60'}>
          <MenuItem
            colorScheme='success'
            icon={<BiSolidEdit />}
            onSelect={() => props.onToggleEditText(true)}
          >
            Change Title
          </MenuItem>

          <Show when={props.links?.length > 0}>
            <MenuItem
              colorScheme='primary'
              icon={<HiOutlineLink />}
              onSelect={handleLinksToggle}
            >
              {props.islinksEditing() ? 'Cancel edit links' : 'Edit Links'}
            </MenuItem>
          </Show>
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

          <ModalHeader>
            Are you sure you want to delete "{props.categoryTitle}" ?
          </ModalHeader>
          <ModalBody p='$4'>
            <Text as='p'>
              Deleting this means you won't be able to recover the content and
              its links.
            </Text>
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
