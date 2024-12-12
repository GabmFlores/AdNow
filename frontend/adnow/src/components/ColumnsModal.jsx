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
  Text,
  Box,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useColumn } from "../store/Column";

function ColumnsModal({ title, isOpen, onClose, columnData, refreshColumns }) {
  const { updateColumn, deleteColumn } = useColumn();
  const toast = useToast();
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);

  useEffect(() => {
    setFormData(columnData || {});
  }, [columnData]);

  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    if (!formData._id) {
      toast({
        title: "Invalid column data",
        description: "Column ID is missing.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setLoading(true);
    const result = await updateColumn(formData._id, formData);
    if (result.success) {
      toast({
        title: result.message,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      refreshColumns(); // Refresh columns after saving
      onClose();
    } else {
      toast({
        title: "Error",
        description: result.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
    setLoading(false);
  };

  const handleDelete = async () => {
    setLoading(true);
    const result = await deleteColumn(formData._id);
    if (result.success) {
      toast({
        title: "Column deleted successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      refreshColumns(); // Refresh columns after deletion
      setDeleteModalOpen(false);
      onClose();
    } else {
      toast({
        title: "Error",
        description: result.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
    setLoading(false);
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} isCentered size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{title}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mb={4}>
              <FormLabel>Title</FormLabel>
              <Input
                value={formData.columnTitle || ""}
                onChange={(e) => handleChange("columnTitle", e.target.value)}
              />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Author</FormLabel>
              <Input
                value={formData.author || ""}
                onChange={(e) => handleChange("author", e.target.value)}
              />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Content</FormLabel>
              <Input
                value={formData.content || ""}
                onChange={(e) => handleChange("content", e.target.value)}
              />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Image URL</FormLabel>
              <Input
                value={formData.image || ""}
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
          <ModalFooter justifyContent="space-between">
            <Button
              colorScheme="red"
              variant="outline"
              onClick={() => setDeleteModalOpen(true)}
              isLoading={loading}
            >
              Delete Column
            </Button>
            <Box>
              <Button
                colorScheme="blue"
                mr={3}
                onClick={handleSave}
                isLoading={loading}
              >
                Save Changes
              </Button>
              <Button variant="ghost" onClick={onClose}>
                Cancel
              </Button>
            </Box>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Are you sure?</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>
              Are you sure you want to delete this column? This action cannot be
              undone.
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="red"
              mr={3}
              onClick={handleDelete}
              isLoading={loading}
            >
              Yes, Delete
            </Button>
            <Button variant="ghost" onClick={() => setDeleteModalOpen(false)}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

ColumnsModal.propTypes = {
  title: PropTypes.string.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  columnData: PropTypes.object,
  refreshColumns: PropTypes.func.isRequired, // New prop for refreshing columns
};

export default ColumnsModal;
