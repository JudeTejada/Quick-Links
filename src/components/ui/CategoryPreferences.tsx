import {
  Button,
  ButtonGroup,
  createDisclosure,
  Icon,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger
} from '@hope-ui/solid';
import { HiOutlineDotsHorizontal } from 'solid-icons/hi';
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
      .eq('id', props.categoryId);

    if (data) setIsLoading(true);
    if (error) alert(error);
  };

  return (
    <>
      <Popover placement='bottom-start' triggerMode='click'>
        <PopoverTrigger as={HiOutlineDotsHorizontal}>Trigger</PopoverTrigger>
        <PopoverContent maxW={'$60'}>
          <PopoverArrow />
          <PopoverCloseButton />
          <PopoverHeader>Change Category</PopoverHeader>

          <PopoverBody display={'flex'} flexDirection='column' rowGap='$2'>
            <Button
              css={{ margin: '0' }}
              onClick={() => props.onToggleEditText(true)}
            >
              edit title
            </Button>
            <Button css={{ margin: '0' }} colorScheme='danger' onClick={onOpen}>
              delete category
            </Button>
          </PopoverBody>
        </PopoverContent>
      </Popover>
      <Modal centered opened={isOpen()} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalBody>
            Are you sure you want to delete "{props.categoryTitle}" ?
          </ModalBody>

          <ModalFooter gap='$4'>
            <Button onClick={onClose}>Cancel</Button>
            <Button colorScheme='danger' onClick={handleDelete}>
              Confirm
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
