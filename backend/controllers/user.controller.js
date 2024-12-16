import mongoose from "mongoose";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const getUsersById = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ success: false, message: "User Not Found" });
  }

  try {
    const user = await User.findById(id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User Not Found" });
    }
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    console.error("Error in fetching user:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const getUsers = async (req, res) => {
  try {
    // Fetch all users from the database
    const users = await User.find({});
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    console.error("Error in fetching users:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const createUser = async (req, res) => {
  const { username, email, password, invitationCode } = req.body;

  try {
    if (invitationCode !== process.env.ADMIN_SECRET_KEY) {
      return res.status(400).json({
        success: false,
        message: "Invalid invitation code.",
      });
    }

    // Check if username or email is already taken
    const existingUser = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Username or email is already in use.",
      });
    }

    // Hash the password
    const passwordRaw = password; // Store the raw password temporarily
    const saltRounds = 10; // You can adjust this number for more security
    const passwordHashed = await bcrypt.hash(passwordRaw, saltRounds); // Hash the raw password

    // Create a new user with the hashed password
    const newUser = new User({ username, email, password: passwordHashed });
    await newUser.save();
    req.session.userId = newUser._id;

    res.status(201).json({
      success: true,
      message: "User created successfully!",
      data: newUser,
    });
  } catch (error) {
    console.error("Error creating user:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};

// Delete a user
export const deleteUser = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ success: false, message: "User Not Found" });
  }

  try {
    await User.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "User Deleted" });
  } catch (error) {
    console.error("Error in deleting user:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Update a user
export const updateUser = async (req, res) => {
  const { id } = req.params;
  const userData = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ success: false, message: "User Not Found" });
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(id, userData, {
      new: true,
      select: "+email +password", // Include `select: false` fields if needed
    });
    res.status(200).json({ success: true, data: updatedUser });
  } catch (error) {
    console.error("Error in updating user:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const loginUser = async (req, res, next) => {
  const { username, password } = req.body;

  try {
    // Check if parameters are missing
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Parameters missing",
      });
    }

    // Find the user by username
    const user = await User.findOne({ username: username }).select(
      "+password +email"
    );

    // If user is not found, send error response
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Compare the password
    const passwordMatch = await bcrypt.compare(password, user.password);

    // If password doesn't match, send error response
    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Store user ID in session
    req.session.userId = user._id;

    // Return the user data without the password in the response
    res.status(201).json({
      success: true,
      message: "Login successful",
      data: {
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Error during login:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};

export const getAuthenticatedUser = async (req, res, next) => {
  console.log("PRODUCTION AUTH CHECK:");
  console.log("Session ID:", req.sessionID);
  console.log("Session:", JSON.stringify(req.session));
  console.log("Cookies:", req.headers.cookie);
  console.log("Node Env:", process.env.NODE_ENV);
  const authenticatedUserId = req.session.userId; // Get user ID from the session

  console.log("Authenticated User ID from session:", authenticatedUserId); // Log the session ID

  try {
    // Check if the user is authenticated (i.e., if userId exists in the session)
    if (!authenticatedUserId) {
      console.log("No user authenticated, session is missing userId"); // Log if the user is not authenticated
      return res.status(401).json({
        success: false,
        message: "User not authenticated", // Return a 401 status with a message
      });
    }

    // Find the user by their ID, including email in the response
    console.log("Fetching user with ID:", authenticatedUserId); // Log the user ID being searched for
    const user = await User.findById(authenticatedUserId)
      .select("+email")
      .exec();

    // If user is found, send it as a response
    if (!user) {
      console.log("User not found for ID:", authenticatedUserId); // Log if user is not found
      return res.status(404).json({
        success: false,
        message: "User not found", // Return a 404 status if user is not found
      });
    }

    res.status(200).json({
      success: true,
      user: user, // Return the user data in the response
    });
  } catch (error) {
    // Handle any unexpected errors and send a generic server error response
    console.error("Error fetching user:", error);
    return res.status(500).json({
      success: false,
      message: "Server error. Please try again later.", // Return a 500 status on server error
    });
  }
};

export const logoutUser = (req, res) => {
  // Destroy the session, effectively logging out the user
  req.session.destroy((err) => {
    if (err) {
      return res
        .status(500)
        .json({ success: false, message: "Failed to log out" });
    }
    // Clear the session cookie from the client
    res.clearCookie("connect.sid");
    res
      .status(200)
      .json({ success: true, message: "User logged out successfully" });
  });
};
