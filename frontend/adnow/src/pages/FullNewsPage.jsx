import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Text,
  Image,
  VStack,
  Button,
  IconButton,
  Flex,
} from "@chakra-ui/react";
import { ChevronLeftIcon } from "@chakra-ui/icons"; // Back icon
import { useColumn } from "../store/Column"; // Import zustand store

const FullNewsPage = () => {
  const { id } = useParams(); // Get the column ID from the URL
  const [column, setColumn] = useState(null);
  const { columns, fetchColumns } = useColumn(); // Access columns from zustand store
  const navigate = useNavigate(); // For navigation

  // Fetch column details by ID from zustand columns state
  useEffect(() => {
    // Fetch columns initially if they are not already loaded
    if (columns.length === 0) {
      fetchColumns(); // Fetch all columns first
    }

    const selectedColumn = columns.find((col) => col._id === id); // Find column by ID
    setColumn(selectedColumn); // Set column data to state
  }, [id, columns, fetchColumns]); // Fetch again if columns or id changes

  if (!column) return <Text>Loading...</Text>;

  return (
    <Box p={6} maxW="800px" mx="auto">
      {/* Back button at the top */}
      <Flex align="center" mb={4}>
        <IconButton
          icon={<ChevronLeftIcon />}
          onClick={() => navigate(-1)} // Go back in history
          aria-label="Go Back"
          colorScheme="blue"
        />
      </Flex>

      <Image
        src={column.image || "https://via.placeholder.com/800x400"} // Fallback image
        alt={column.columnTitle}
        width="100%"
        height="auto"
        maxH="500px" // Limit the height of the image for better sizing
        objectFit="cover" // Maintain aspect ratio while covering the space
        mb={6} // Add margin bottom for spacing
      />

      <VStack align="start" spacing={6}>
        {/* Column Title */}
        <Text fontSize="4xl" fontWeight="bold" color="gray.800" mb={4}>
          {column.columnTitle}
        </Text>

        {/* Author and Published Date */}
        <Text fontSize="md" color="gray.500" mb={4}>
          By {column.author || "Unknown Author"} | {column.publishedDate}
        </Text>

        {/* Main Content */}
        <Box
          p={4}
          borderRadius="md"
          boxShadow="md"
          bg="gray.50"
          lineHeight="1.8"
          textIndent="1.5em" // Indentation for paragraphs
        >
          <Text fontSize="lg" color="gray.700">
            {column.content}
          </Text>
        </Box>
      </VStack>

      <Box mt={6}>
        <Button colorScheme="blue" onClick={() => navigate(-1)} width="full">
          Go Back
        </Button>
      </Box>
    </Box>
  );
};

export default FullNewsPage;
