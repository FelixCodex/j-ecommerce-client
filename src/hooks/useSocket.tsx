import { io } from "socket.io-client";
import { useChat } from "./useChat";
import { useCallback, useEffect } from "react";

const socket = io("https://modelfantasy.up.railway.app", {
  transports: ["websocket"],
  auth: {},
});

socket.on("connection", () => {
  console.log("Socket connected");
});

export function useSocket() {
  const { addMessageToChat } = useChat();

  useEffect(() => {
    const handleNewMessage = (message: string) => {
      const parsedMessage = JSON.parse(message);
      addMessageToChat(parsedMessage);
      const sound = new Audio("/message_alert.wav");
      sound.play();
    };

    socket.off("newMessage");
    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [addMessageToChat]);

  const connectUserToMessageChannel = useCallback(({ id }: { id: string }) => {
    socket.disconnect();
    socket.auth = { userId: id };
    socket.connect();

    socket.emit("connectChat");
    console.log("Chat connected");
  }, []);

  return { connectUserToMessageChannel };
}
