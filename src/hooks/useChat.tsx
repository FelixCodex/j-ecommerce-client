import { useContext } from "react";
import { ChatContext } from "../context/chat.context";

export function useChat() {
  const context = useContext(ChatContext);
  if (context == undefined) {
    throw new Error("useProduct must be used within aProductProvider");
  }
  return context;
}

// export function useChat() {
//   const [isInChat, setIsInChat] = useState(true);
//   const [isChatOpen, setIsChatOpen] = useState(false);
//   const [chat, setChat] = useState([] as ChatMessage[]);
//   const [loadingChat, setLoadingChat] = useState(true);

//   const addMessageToChat = (chatMesssage: ChatMessage) => {
//     const newState = { ...chat, chatMesssage };
//     setChat(newState);
//     return newState;
//   };

//   const loadMessages = async () => {
//     setLoadingChat(true);
//     try {
//       const res = await getMessagesRequest();
//       console.log("Response from products: ", res);
//       if (res.status == 200) {
//         setChat(res.data);
//       } else {
//         setChat([] as ChatMessage[]);
//       }
//     } catch (error) {
//       console.log("Error fetching products data: ", error);
//     } finally {
//       setLoadingChat(false);
//     }
//   };

//   return {
//     isInChat,
//     setIsInChat,
//     isChatOpen,
//     setIsChatOpen,
//     chat,
//     addMessageToChat,
//     loadMessages,
//     loadingChat,
//   };
// }
