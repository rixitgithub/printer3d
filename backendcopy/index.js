import express from "express";
import cors from "cors";
import path from "path";
import url, { fileURLToPath } from "url";
import ImageKit from "imagekit";
import mongoose, { model } from "mongoose";
import Chat from "./models/chat.js";
import UserChats from "./models/userChats.js";
import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";
import 'dotenv/config';

const port = process.env.PORT || 3000;
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

app.use((req, res, next) => {
  console.log("Middleware running");
  next();
});

app.use(express.json());

const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Connected to MongoDB");
  } catch (err) {
    console.error("❌ MongoDB Connection Error:", err.message);
    process.exit(1); // Stop server if MongoDB fails
  }
};

const imagekit = new ImageKit({
  urlEndpoint: process.env.IMAGE_KIT_ENDPOINT,
  publicKey: process.env.IMAGE_KIT_PUBLIC_KEY,
  privateKey: process.env.IMAGE_KIT_PRIVATE_KEY,
});

app.get("/api/upload", (req, res) => {
  const result = imagekit.getAuthenticationParameters();
  res.send(result);
});

app.post("/api/chats", ClerkExpressRequireAuth(), async (req, res) => {
  const userId = req.auth.userId;
  const { text } = req.body;

  try {
    // CREATE A NEW CHAT
    const newChat = new Chat({
      userId: userId,
      history: [{ role: "user", parts: [{ text }] }],
    });

    const savedChat = await newChat.save();

    // CHECK IF THE USERCHATS EXISTS
    const userChats = await UserChats.find({ userId: userId });

    // IF DOESN'T EXIST CREATE A NEW ONE AND ADD THE CHAT IN THE CHATS ARRAY
    if (!userChats.length) {
      const newUserChats = new UserChats({
        userId: userId,
        chats: [
          {
            _id: savedChat._id,
            title: text.substring(0, 40),
          },
        ],
      });

      await newUserChats.save();
    } else {
      // IF EXISTS, PUSH THE CHAT TO THE EXISTING ARRAY
      await UserChats.updateOne(
        { userId: userId },
        {
          $push: {
            chats: {
              _id: savedChat._id,
              title: text.substring(0, 40),
            },
          },
        }
      );

      res.status(201).send(newChat._id);
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("Error creating chat!");
  }
});

app.get("/api/userchats", ClerkExpressRequireAuth(), async (req, res) => {
  try {
    console.log("Request authenticated:", req.auth);
    const userId = req.auth?.userId; // Ensure userId exists
    if (!userId) return res.status(401).json({ error: "Unauthorized!" });

    const userChats = await UserChats.find({ userId });
    res.status(200).json(userChats[0]?.chats || []);
  } catch (err) {
    console.error("Error fetching user chats:", err);
    res.status(500).json({ error: "Error fetching user chats!" });
  }
});

app.get("/api/chats/:id", ClerkExpressRequireAuth(), async (req, res) => {
  const userId = req.auth.userId;

  try {
    const chat = await Chat.findOne({ _id: req.params.id, userId });

    res.status(200).send(chat);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error fetching chat!");
  }
});

app.put("/api/chats/:id", ClerkExpressRequireAuth(), async (req, res) => {
  const userId = req.auth.userId;
  const { question, answer, img, video } = req.body;
  let chatId = req.params.id;

  // Validate video format if present
  if (video && (!video.title || !video.url || !video.thumbnail)) {
    return res.status(400).json({ error: "Invalid video format." });
  }

  // Build new conversation items
  const newItems = [];

  // Always add the user's question with an optional image
  newItems.push({
    role: "user",
    parts: [{ text: question }],
    ...(img && { img }),
  });

  // Add the model response if either text or video exists
  if (answer || video) {
    newItems.push({
      role: "model",
      parts: answer ? [{ text: answer }] : [],
      ...(video && {
        video: {
          title: video.title,
          url: video.url,
          thumbnail: video.thumbnail,
        },
      }),
    });
  }

  try {
    // If the chatId is not provided (or explicitly "null"), create a new chat first
    if (!chatId || chatId === "null") {
      // Create a new chat with an empty history (we'll add our new items next)
      const newChat = new Chat({
        userId: userId,
        history: [],
      });
      const savedChat = await newChat.save();
      chatId = savedChat._id;

      // Update the user's chat list, similar to your POST endpoint
      const userChats = await UserChats.find({ userId: userId });
      if (!userChats.length) {
        const newUserChats = new UserChats({
          userId: userId,
          chats: [
            {
              _id: savedChat._id,
              title: question.substring(0, 40),
            },
          ],
        });
        await newUserChats.save();
      } else {
        await UserChats.updateOne(
          { userId: userId },
          {
            $push: {
              chats: {
                _id: savedChat._id,
                title: question.substring(0, 40),
              },
            },
          }
        );
      }
    }

    // Now update the chat (either the newly created one or the existing one)
    const updatedChat = await Chat.findOneAndUpdate(
      { _id: chatId, userId },
      { $push: { history: { $each: newItems } } },
      { new: true }
    );

    if (!updatedChat) {
      return res.status(404).json({ error: "Chat not found or unauthorized." });
    }

    res.status(200).json(updatedChat);
  } catch (err) {
    console.error("Error updating chat:", err);
    res.status(500).json({ error: "Error adding conversation!" });
  }
});


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(401).send("Unauthenticated!");
});

// PRODUCTION
// app.use(express.static(path.join(__dirname, "../client/dist")));

// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "../client/dist", "index.html"));
// });

app.listen(port, () => {
  connect();
  console.log("Server running on 3000");
});