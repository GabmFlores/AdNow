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
  FormErrorMessage,
} from "@chakra-ui/react";
import { useState } from "react";
import PropTypes from "prop-types";
import { useColumn } from "../store/Column";

function NewColumnModal({ isOpen, onClose, refreshColumns }) {
  const toast = useToast();
  const createColumn = useColumn((state) => state.createColumn);
  const [formData, setFormData] = useState({
    columnTitle: "",
    author: "",
    content: "",
    image: "",
  });
  const [errors, setErrors] = useState({
    columnTitle: "",
    author: "",
    content: "",
    image: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: "" })); // Clear error when the field is updated
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {};

    if (!formData.columnTitle) {
      newErrors.columnTitle = "Title is required";
      isValid = false;
    }

    if (!formData.author) {
      newErrors.author = "Author is required";
      isValid = false;
    }

    if (!formData.content) {
      newErrors.content = "Content is required";
      isValid = false;
    }

    // Optionally validate the image URL (basic check for URL format)
    if (
      formData.image &&
      !/^(ftp|http|https):\/\/[^ "]+$/.test(formData.image)
    ) {
      newErrors.image = "Invalid image URL";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleCreate = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    const result = await createColumn(formData);
    setLoading(false);

    if (result.success) {
      toast({
        title: "Column created successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      refreshColumns();
      onClose();
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
          <FormControl mb={4} isInvalid={!!errors.columnTitle}>
            <FormLabel>Title</FormLabel>
            <Input
              value={formData.columnTitle}
              onChange={(e) => handleChange("columnTitle", e.target.value)}
            />
            <FormErrorMessage>{errors.columnTitle}</FormErrorMessage>
          </FormControl>

          <FormControl mb={4} isInvalid={!!errors.author}>
            <FormLabel>Author</FormLabel>
            <Input
              value={formData.author}
              onChange={(e) => handleChange("author", e.target.value)}
            />
            <FormErrorMessage>{errors.author}</FormErrorMessage>
          </FormControl>

          <FormControl mb={4} isInvalid={!!errors.content}>
            <FormLabel>Content</FormLabel>
            <Input
              value={formData.content}
              onChange={(e) => handleChange("content", e.target.value)}
            />
            <FormErrorMessage>{errors.content}</FormErrorMessage>
          </FormControl>

          <FormControl mb={4} isInvalid={!!errors.image}>
            <FormLabel>Image URL</FormLabel>
            <Input
              value={formData.image}
              onChange={(e) => handleChange("image", e.target.value)}
            />
            <FormErrorMessage>{errors.image}</FormErrorMessage>
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
  refreshColumns: PropTypes.func.isRequired,
};

export default NewColumnModal;
