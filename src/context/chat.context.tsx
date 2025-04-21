/* eslint-disable @typescript-eslint/no-unused-vars */
import { createContext, useCallback, useEffect, useState } from "react";
import { ChatMessage } from "../types";
import { getMessagesRequest } from "../Api/chat";

interface ChatContextType {
  isInChat: boolean;
  setIsInChat: (bool: boolean) => void;
  isChatOpen: boolean;
  loadingChat: boolean;
  notSeenMessages: number;
  setIsChatOpen: (bool: boolean) => void;
  chat: ChatMessage[];
  setNotSeenMessagesToSeen: () => void;
  addMessageToChat: (chatMesssage: ChatMessage) => void;
  loadMessages: () => void;
  loadingMessage: LoadingMessage[];
  errorMessage: LoadingMessage[];
  addLoadingMessage: (message: LoadingMessage) => void;
  removeLoadingMessage: (message: LoadingMessage) => void;
  addErrorMessage: (message: LoadingMessage) => void;
  removeErrorMessage: (message: LoadingMessage) => void;
  clearChat: () => void;
}

interface ChatProviderProps {
  children: import("react").ReactElement;
}

interface LoadingMessage {
  id: string;
}

export const ChatContext = createContext<ChatContextType>({
  isInChat: true,
  setIsInChat: () => {},
  isChatOpen: false,
  notSeenMessages: 0,
  loadingChat: true,
  setIsChatOpen: () => {},
  loadingMessage: [] as LoadingMessage[],
  errorMessage: [] as LoadingMessage[],
  chat: [] as ChatMessage[],
  setNotSeenMessagesToSeen: () => {},
  addMessageToChat: (chatMesssage: ChatMessage) => {},
  loadMessages: () => {},
  addLoadingMessage: (message: LoadingMessage) => {},
  removeLoadingMessage: (message: LoadingMessage) => {},
  addErrorMessage: (message: LoadingMessage) => {},
  removeErrorMessage: (message: LoadingMessage) => {},
  clearChat: () => {},
});

export function ChatProvider({ children }: ChatProviderProps) {
  const [isInChat, setIsChat] = useState(true);
  const [isChatOpen, setIsOpen] = useState(false);
  const [notSeenMessages, setNotSeenMessages] = useState(0);
  const [loadingChat, setLoadingChat] = useState(true);
  const [chat, setChat] = useState([] as ChatMessage[]);
  const [loadingMessage, setLoadingMessage] = useState([] as LoadingMessage[]);
  const [errorMessage, setErrorMessage] = useState([] as LoadingMessage[]);

  const addMessageToChat = useCallback((chatMessage: ChatMessage) => {
    setChat((prevChat) => [...prevChat, chatMessage]);
    setNotSeenMessages((prev) => prev + 1);
  }, []);

  const setNotSeenMessagesToSeen = () => {
    setNotSeenMessages(0);
  };

  const addLoadingMessage = (message: LoadingMessage) => {
    const newState = [...loadingMessage, message];
    setLoadingMessage(newState);
    return newState;
  };

  const removeLoadingMessage = (message: LoadingMessage) => {
    const newState = loadingMessage.filter((el) => el.id != message.id);
    setLoadingMessage(newState);
    return newState;
  };

  const addErrorMessage = (message: LoadingMessage) => {
    const newState = [...errorMessage, message];
    setErrorMessage(newState);
    return newState;
  };

  const removeErrorMessage = (message: LoadingMessage) => {
    const newState = errorMessage.filter((el) => el.id != message.id);
    setErrorMessage(newState);
    return newState;
  };

  const clearChat = () => {
    setChat([] as ChatMessage[]);
    return [];
  };

  const loadMessages = async () => {
    setLoadingChat(true);
    try {
      const res = await getMessagesRequest();
      console.log("Response from chats: ", res);
      if (!res) throw new Error("Chat request failed");
      if (res.status == 200) {
        setChat(res.data);
      } else {
        setChat([] as ChatMessage[]);
      }
    } catch (error) {
      console.log("Error fetching chat data: ", error);
      setChat([] as ChatMessage[]);
    } finally {
      setLoadingChat(false);
    }
  };

  useEffect(() => {
    loadMessages();
  }, []);

  const setIsChatOpen = (bool: boolean) => {
    setIsOpen(bool);
  };

  const setIsInChat = (bool: boolean) => {
    setIsChat(bool);
  };

  return (
    <ChatContext.Provider
      value={{
        isInChat,
        setIsInChat,
        isChatOpen,
        setIsChatOpen,
        loadingChat,
        chat,
        addMessageToChat,
        loadMessages,
        addLoadingMessage,
        loadingMessage,
        removeLoadingMessage,
        clearChat,
        addErrorMessage,
        removeErrorMessage,
        errorMessage,
        notSeenMessages,
        setNotSeenMessagesToSeen,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}
