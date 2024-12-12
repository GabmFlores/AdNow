import {
  Box,
  Text,
  VStack,
  Input,
  Textarea,
  Button,
  Icon,
  SimpleGrid,
  useToast,
} from "@chakra-ui/react";
import { FaPhone, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import { useState } from "react";
import axios from "axios";

const ContactPage = () => {
  const toast = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const response = await axios.post("/api/contact", formData);
      if (response.status === 200) {
        toast({
          title: "Message Sent",
          description:
            "Thank you for reaching out. We will get back to you soon.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        setFormData({ name: "", email: "", message: "" });
      }
    } catch (error) {
      console.error("Error submitting contact form:", error);
      toast({
        title: "Error",
        description:
          "There was an issue submitting your message. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box bg="gray.50" minH="100vh" p={8} pt={{ base: 16, md: 20 }}>
      <Text
        fontSize={{ base: "3xl", md: "5xl" }}
        fontWeight="bold"
        textAlign="center"
        mb={8}
        color="gray.800"
      >
        Contact Us
      </Text>

      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10} mb={10}>
        {/* Contact Information */}
        <VStack
          align="start"
          spacing={4}
          bg="white"
          p={6}
          borderRadius="lg"
          boxShadow="lg"
        >
          <Text fontSize="2xl" fontWeight="bold" color="gray.700">
            Get in Touch
          </Text>
          <VStack align="start" spacing={3}>
            <Box display="flex" alignItems="center">
              <Icon as={FaPhone} w={5} h={5} color="teal.500" mr={3} />
              <Text fontSize="md" color="gray.600">
                +63 (054) 123-4567
              </Text>
            </Box>
            <Box display="flex" alignItems="center">
              <Icon as={FaEnvelope} w={5} h={5} color="teal.500" mr={3} />
              <Text fontSize="md" color="gray.600">
                adnu@infirmary.edu.ph
              </Text>
            </Box>
            <Box display="flex" alignItems="center">
              <Icon as={FaMapMarkerAlt} w={5} h={5} color="teal.500" mr={3} />
              <Text fontSize="md" color="gray.600">
                Ateneo de Naga University, Naga City, Philippines
              </Text>
            </Box>
          </VStack>
        </VStack>

        {/* Contact Form */}
        <VStack align="start" bg="white" p={6} borderRadius="lg" boxShadow="lg">
          <Text fontSize="2xl" fontWeight="bold" color="gray.700" mb={4}>
            Send Us a Message
          </Text>
          <Input
            placeholder="Your Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            bg="gray.100"
            borderRadius="md"
            mb={4}
          />
          <Input
            placeholder="Your Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            bg="gray.100"
            borderRadius="md"
            mb={4}
          />
          <Textarea
            placeholder="Your Message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            bg="gray.100"
            borderRadius="md"
            mb={4}
          />
          <Button
            colorScheme="teal"
            width="full"
            onClick={handleSubmit}
            isLoading={isSubmitting}
          >
            Send Message
          </Button>
        </VStack>
      </SimpleGrid>
    </Box>
  );
};

export default ContactPage;
