import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  FormControl,
  FormLabel,
  Input,
  Image,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import PropTypes from "prop-types";
import { useColumn } from "../store/Column";

function NewColumnModal({ isOpen, onClose, refreshColumns }) {
  const toast = useToast();
  const createColumn = useColumn((state) => state.createColumn); // Action to create a column
  const [formData, setFormData] = useState({
    columnTitle: "",
    author: "",
    content: "",
    image: "",
  });
  const [loading, setLoading] = useState(false); // Loading state for button

  // Update form data on input change
  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  // Handle creating a new column
  const handleCreate = async () => {
    setLoading(true);
    const result = await createColumn(formData); // Call the createColumn action
    setLoading(false);

    if (result.success) {
      toast({
        title: "Column created successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      // Refresh the columns list after successful creation
      refreshColumns();

      // Close the modal
      onClose();

      // Reset the form
      setFormData({
        columnTitle: "",
        author: "",
        content: "",
        image: "",
      });
    } else {
      toast({
        title: "Error creating column",
        description: result.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create New Column</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl mb={4}>
            <FormLabel>Title</FormLabel>
            <Input
              value={formData.columnTitle}
              onChange={(e) => handleChange("columnTitle", e.target.value)}
            />
          </FormControl>
          <FormControl mb={4}>
            <FormLabel>Author</FormLabel>
            <Input
              value={formData.author}
              onChange={(e) => handleChange("author", e.target.value)}
            />
          </FormControl>
          <FormControl mb={4}>
            <FormLabel>Content</FormLabel>
            <Input
              value={formData.content}
              onChange={(e) => handleChange("content", e.target.value)}
            />
          </FormControl>
          <FormControl mb={4}>
            <FormLabel>Image URL</FormLabel>
            <Input
              value={formData.image}
              onChange={(e) => handleChange("image", e.target.value)}
            />
          </FormControl>
          {formData.image && (
            <Image
              src={formData.image}
              alt="Preview"
              boxSize="200px"
              objectFit="cover"
              mt={4}
              borderRadius="md"
              boxShadow="md"
            />
          )}
        </ModalBody>
        <ModalFooter>
          <Button
            colorScheme="blue"
            mr={3}
            onClick={handleCreate}
            isLoading={loading}
          >
            Create Column
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

NewColumnModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  refreshColumns: PropTypes.func.isRequired, // Prop for refreshing columns list
};

export default NewColumnModal;
