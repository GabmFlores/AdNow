import { Box, Button, Stack, useDisclosure } from "@chakra-ui/react";
import { FaInbox, FaCalendarAlt, FaPlus } from "react-icons/fa";
import { Link } from "react-router-dom";
import CreateModalApp from "./CreateModalApp"; // Updated modal import

function InboxSide() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box
      ml="100"
      position="sticky"
      top="250px"
      width="250"
      maxHeight="calc(100vh - 100px)"
      bg="teal.800"
      color="white"
      boxShadow="lg"
      p={4}
      borderRadius="lg"
      display="flex"
      flexDirection="column"
      justifyContent="flex-start"
      alignItems="center"
    >
      <Stack spacing={6} width="100%" align="center">
        <Link to="/inbox">
          <Button
            variant="ghost"
            width="100%"
            leftIcon={<FaInbox />}
            fontSize="20px"
            color="white"
            _hover={{ backgroundColor: "teal.700" }}
          >
            Inbox
          </Button>
        </Link>
        <Link to="/calendar">
          <Button
            variant="ghost"
            width="100%"
            leftIcon={<FaCalendarAlt />}
            fontSize="20px"
            color="white"
            _hover={{ backgroundColor: "teal.700" }}
          >
            Calendar
          </Button>
        </Link>
        {/* + New Button */}
        <Button
          onClick={onOpen}
          leftIcon={<FaPlus />}
          fontSize="20px"
          bg="green.500"
          color="white"
          _hover={{ bg: "green.600" }}
          width="100%"
        >
          New
        </Button>
      </Stack>
      {/* Modal for Creating Appointment */}
      <CreateModalApp isOpen={isOpen} onClose={onClose} />
    </Box>
  );
}

export default InboxSide;
