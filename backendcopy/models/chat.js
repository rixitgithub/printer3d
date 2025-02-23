import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    history: [
      {
        role: {
          type: String,
          enum: ["user", "model"],
          required: true,
        },
        parts: [
          {
            text: {
              type: String,
              required: true,
            },
          },
        ],
        img: {
          type: String,
          default: null,
        },
        video: {
          title: String,
          url: String,
          thumbnail: String,
        },
      },
    ],
  },
  { timestamps: true }
);


const Chat = mongoose.models.Chat || mongoose.model("Chat", chatSchema);
export default Chat;
