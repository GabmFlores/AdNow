import PropTypes from "prop-types";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Flex,
  Input,
  FormControl,
  FormLabel,
  Avatar,
  IconButton,
  useToast,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { usePatient } from "../store/Patient";
import { FaUser, FaImage, FaTrash } from "react-icons/fa";

function FilesModalDetails({
  title,
  isOpen,
  onClose,
  patientData,
  refreshFiles,
}) {
  const toast = useToast();
  const { updatePatient, deletePatient } = usePatient();
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState("details");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    setFormData(patientData || {});
  }, [patientData]);

  const excludedFields = ["__v", "createdAt", "updatedAt", "_id"];

  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    const hasChanges = Object.entries(formData).some(([key, value]) => {
      if (excludedFields.includes(key)) return false;
      return value?.trim() !== patientData[key]?.trim();
    });

    if (!hasChanges) {
      toast({
        title: "No changes made.",
        status: "info",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      setLoading(true);
      const response = await updatePatient(patientData._id, formData);
      toast({
        title: response.message,
        status: response.success ? "success" : "error",
        duration: 3000,
        isClosable: true,
      });
      if (response.success) {
        refreshFiles();
        onClose();
      }
    } catch (error) {
      toast({
        title: "Error saving changes.",
        description: error.message || "An unexpected error occurred.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      const response = await deletePatient(patientData._id);
      toast({
        title: response.message,
        status: response.success ? "success" : "error",
        duration: 3000,
        isClosable: true,
      });
      if (response.success) {
        refreshFiles();
        onClose();
      }
    } catch (error) {
      toast({
        title: "Error deleting patient.",
        description: error.message || "An unexpected error occurred.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
      setIsDeleteModalOpen(false);
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} isCentered={false} size="full">
        <ModalOverlay />
        <ModalContent
          position="absolute"
          right={0}
          top={0}
          bottom={0}
          w={{ base: "100%", md: "66%" }}
          m={0}
          overflowY="auto"
        >
          <ModalHeader>{title}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {formData.image && (
              <Flex
                justifyContent="center"
                mb={4}
                direction="column"
                alignItems="center"
              >
                <Avatar
                  size="2xl"
                  src={formData.image}
                  name={`${formData.firstName} ${formData.lastName}`}
                  mb={4}
                />
                <Flex gap={2}>
                  <IconButton
                    icon={<FaUser />}
                    aria-label="Details"
                    onClick={() => setCurrentPage("details")}
                    colorScheme={currentPage === "details" ? "blue" : "gray"}
                  />
                  <IconButton
                    icon={<FaImage />}
                    aria-label="Images"
                    onClick={() => setCurrentPage("images")}
                    colorScheme={currentPage === "images" ? "blue" : "gray"}
                  />
                  <IconButton
                    icon={<FaTrash />}
                    aria-label="Trash"
                    onClick={() => setIsDeleteModalOpen(true)}
                    colorScheme="red"
                  />
                </Flex>
              </Flex>
            )}

            {currentPage === "details" && (
              <>
                <FormControl mb={4}>
                  <FormLabel>Image URL</FormLabel>
                  <Input
                    value={formData.image || ""}
                    onChange={(e) => handleChange("image", e.target.value)}
                    placeholder="Enter image URL"
                  />
                </FormControl>
                <Flex wrap="wrap" gap={6} justifyContent="space-between">
                  {Object.entries(formData)
                    .filter(([key]) => !excludedFields.includes(key))
                    .map(([key, value]) => (
                      <FormControl key={key} w={{ base: "100%", md: "48%" }}>
                        <FormLabel textTransform="capitalize">
                          {key.replace(/([A-Z])/g, " $1")}
                        </FormLabel>
                        <Input
                          value={value || ""}
                          onChange={(e) => handleChange(key, e.target.value)}
                        />
                      </FormControl>
                    ))}
                </Flex>
              </>
            )}

            {currentPage === "images" && <p>Images page content goes here.</p>}

            {currentPage === "trash" && <p>Trash page content goes here.</p>}
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={handleSave}
              isLoading={loading}
            >
              Save Changes
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirm Delete</ModalHeader>
          <ModalCloseButton />
          <ModalBody>Are you sure you want to delete this patient?</ModalBody>
          <ModalFooter>
            <Button
              colorScheme="red"
              mr={3}
              onClick={handleDelete}
              isLoading={loading}
            >
              Delete
            </Button>
            <Button variant="ghost" onClick={() => setIsDeleteModalOpen(false)}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

FilesModalDetails.propTypes = {
  title: PropTypes.string.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  patientData: PropTypes.object,
  refreshFiles: PropTypes.func.isRequired,
};

export default FilesModalDetails;
