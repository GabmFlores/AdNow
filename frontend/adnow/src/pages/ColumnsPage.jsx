import {
  Box,
  Flex,
  Text,
  Input,
  IconButton,
  Button,
  Image,
  useDisclosure,
} from "@chakra-ui/react";
import { FaSearch, FaEllipsisV, FaPlus } from "react-icons/fa";
import { useState, useEffect } from "react";
import axios from "axios";
import ColumnsModal from "../components/ColumnsModal";
import NewColumnModal from "../components/NewColumnModal";

function ColumnsPage() {
  const [columns, setColumns] = useState([]); // Stores all columns
  const [searchQuery, setSearchQuery] = useState(""); // Search query
  const [selectedColumn, setSelectedColumn] = useState(null); // Column selected for editing/viewing

  const { isOpen, onOpen, onClose } = useDisclosure(); // For ColumnsModal
  const {
    isOpen: isNewColumnModalOpen,
    onOpen: onOpenNewColumnModal,
    onClose: onCloseNewColumnModal,
  } = useDisclosure(); // For NewColumnModal

  // Fetch all columns from the API
  const fetchColumns = async () => {
    try {
      const response = await axios.get("/api/columns");
      setColumns(response.data.data);
    } catch (error) {
      console.error("Error fetching columns:", error);
    }
  };

  // Fetch columns when the component mounts
  useEffect(() => {
    fetchColumns();
  }, []);

  // Handles clicking on a column to open its details
  const handleColumnClick = (column) => {
    setSelectedColumn(column);
    onOpen();
  };

  // Filter columns based on the search query
  const filteredColumns = columns.filter(
    (column) =>
      column.columnTitle &&
      column.columnTitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Flex
      height="100vh"
      ml="80px"
      mt="60px"
      p={6}
      flexDirection="column"
      bg="gray.50"
    >
      <Text fontSize="2xl" fontWeight="bold" mb={4}>
        Columns
      </Text>

      {/* Search Input */}
      <Flex mb={6} alignItems="center">
        <Input
          placeholder="Search columns..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          bg="white"
          boxShadow="md"
          borderRadius="md"
        />
        <IconButton
          icon={<FaSearch />}
          aria-label="Search"
          ml={2}
          colorScheme="blue"
        />
      </Flex>

      {/* Columns List */}
      <Box bg="white" boxShadow="md" borderRadius="md" p={4}>
        {filteredColumns.map((column, index) => (
          <Flex key={column._id || index} alignItems="center" mb={4}>
            {/* Column Details */}
            <Box
              flex="2"
              cursor="pointer"
              display="flex"
              alignItems="center"
              onClick={() => handleColumnClick(column)}
            >
              <Image
                src={column.image}
                alt={column.columnTitle}
                boxSize="50px"
                objectFit="cover"
                borderRadius="md"
                mr={4}
              />
              {column.columnTitle}
            </Box>
            <Box flex="1">{column.author || "N/A"}</Box>
            <Box flex="2" noOfLines={1}>
              {column.content}
            </Box>
            <Box flex="0.5">
              <IconButton
                icon={<FaEllipsisV />}
                aria-label="Actions"
                variant="ghost"
                onClick={() => handleColumnClick(column)}
              />
            </Box>
          </Flex>
        ))}
      </Box>

      {/* Add Column Button */}
      <Button
        colorScheme="blue"
        size="lg"
        borderRadius="full"
        position="fixed"
        bottom={6}
        right={6}
        leftIcon={<FaPlus />}
        onClick={onOpenNewColumnModal}
      >
        Add Column
      </Button>

      {/* Modals */}
      <NewColumnModal
        isOpen={isNewColumnModalOpen}
        onClose={onCloseNewColumnModal}
        refreshColumns={fetchColumns} // Pass refresh function to modal
      />
      {selectedColumn && (
        <ColumnsModal
          title="Column Details"
          isOpen={isOpen}
          onClose={onClose}
          columnData={selectedColumn}
          refreshColumns={fetchColumns} // Pass refresh function to modal
        />
      )}
    </Flex>
  );
}

export default ColumnsPage;
