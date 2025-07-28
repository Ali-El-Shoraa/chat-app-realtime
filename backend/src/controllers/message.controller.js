import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../libs/cloudinary.js";

export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const filteredUsers = await User.find({
      _id: { $ne: loggedInUserId }, // Exclude the logged-in user
    }).select("-password");

    res.status(200).json(filteredUsers);
  } catch (error) {
    console.log("Error fetching users for sidebar:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: userChatId } = req.params;
    const myId = req.user._id;

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userChatId },
        { senderId: userChatId, receiverId: myId },
      ],
    });

    res.status(200).json(messages);
  } catch (error) {
    console.log("Error fetching messages:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const sendMessages = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: reciverId } = req.params;
    const senderId = req.user._id;

    let imageUrl;

    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = new Message({
      senderId: senderId,
      receiverId: reciverId,
      text: text,
      image: imageUrl,
    });

    // real time
    res.status(201).json(newMessage);

    await newMessage.save();
  } catch (error) {
    console.log("Error sending message:", error);
    res.status(500).json({
      message: "Internal server error sendMessages",
      error: error.message,
    });
  }
};
