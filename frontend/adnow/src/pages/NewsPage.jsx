import {
  Box,
  Grid,
  GridItem,
  Image,
  Text,
  VStack,
  Button,
  Input,
  Flex,
  useBreakpointValue,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const NewsPage = () => {
  const [columns, setColumns] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const navigate = useNavigate();

  // Fetch columns from the server
  const fetchColumns = async () => {
    try {
      const response = await axios.get("/api/columns");
      setColumns(response.data.data);
    } catch (error) {
      console.error("Error fetching columns:", error);
    }
  };

  useEffect(() => {
    fetchColumns();
  }, []);

  const columnSpan = useBreakpointValue({ base: 1, md: 1, lg: 1, xl: 1 }); // Ensures it always uses one column per item

  // Filter columns based on search query
  const filteredColumns = columns.filter((column) =>
    column.columnTitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box
      minH="100vh"
      bg="gray.50"
      p={{ base: 4, md: 8 }}
      pt={{ base: 16, md: 20 }}
    >
      {/* Header */}
      <Text
        fontSize={{ base: "3xl", md: "5xl" }}
        fontWeight="bold"
        textAlign="center"
        mb={8}
        color="gray.800"
      >
        Latest News
      </Text>

      {/* Search Bar */}
      <Flex mb={8} justifyContent="center">
        <Input
          placeholder="Search news..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          maxW="400px"
          bg="white"
          boxShadow="md"
          borderRadius="md"
        />
      </Flex>

      {/* News Grid */}
      <Grid
        templateColumns={{
          base: "repeat(1, 1fr)", // 1 column on small screens
          sm: "repeat(2, 1fr)", // 2 columns on small-medium screens
          md: "repeat(3, 1fr)", // 3 columns on medium and up
        }}
        gap={6}
      >
        {filteredColumns.map((column) => (
          <GridItem
            key={column._id}
            colSpan={columnSpan}
            bg="white"
            boxShadow="lg"
            borderRadius="lg"
            overflow="hidden"
            transition="transform 0.2s"
            _hover={{ transform: "scale(1.03)" }}
          >
            <Image
              src={column.image || "https://via.placeholder.com/300"} // Fallback image
              alt={column.columnTitle}
              objectFit="cover"
              w="100%"
              h="200px"
            />
            <VStack align="start" p={4} spacing={3}>
              <Text fontSize="xl" fontWeight="bold" color="gray.700">
                {column.columnTitle}
              </Text>
              <Text fontSize="sm" color="gray.500">
                By {column.author || "Unknown Author"}
              </Text>
              <Text fontSize="md" noOfLines={3} color="gray.600">
                {column.content}
              </Text>
              <Button
                size="sm"
                colorScheme="blue"
                onClick={() => navigate(`/columns/${column._id}`)} // Navigate to column details
              >
                Read More
              </Button>
            </VStack>
          </GridItem>
        ))}
      </Grid>
    </Box>
  );
};

export default NewsPage;
