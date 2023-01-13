import { Box, Flex, SkeletonCircle, SkeletonText } from '@hope-ui/solid';

export const BookmarkLoader = () => {
  return (
    <Box>
      <Box>
        <SkeletonText
          mt='$4'
          width={'200px'}
          noOfLines={1}
          spacing='$4'
          mb='$1_5'
        />
        <Flex mb='$6' gap='$2'>
          <SkeletonCircle size='$10' />
          <SkeletonCircle size='$10' />
          <SkeletonCircle size='$10' />
        </Flex>
      </Box>
      <Box>
        <SkeletonText
          mt='$4'
          width={'200px'}
          noOfLines={1}
          spacing='$4'
          mb='$1_5'
        />
        <Flex mb='$6' gap='$2'>
          <SkeletonCircle size='$10' />
          <SkeletonCircle size='$10' />
          <SkeletonCircle size='$10' />
          <SkeletonCircle size='$10' />
        </Flex>
      </Box>
    </Box>
  );
};
