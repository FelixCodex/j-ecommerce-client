import {
  CircleDashed,
  Clock,
  HelpCircleIcon,
  MessageSquareIcon,
  MessageSquareMoreIcon,
  Send,
  X,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import {
  formatDateTime,
  formatHours,
  formatMinutes,
  whichMeridian,
} from "../utils";
import { useAuth } from "../hooks/useAuth";
import { useChat } from "../hooks/useChat";
import { ChatMessage } from "../types";
import { sendMessageRequest } from "../Api/chat";
import { DropDownTab } from "./DropDownTab";

function ChatMessageCard({ chat }: { chat: ChatMessage }) {
  const date =
    chat.created_at == "null" ? null : new Date(chat.created_at + " UTC");
  const { loadingMessage } = useChat();
  return (
    <div
      className={`relative rounded-lg flex max-w-80 min-h-max h-fit w-fit ${
        chat.isMessageFromUser == "true"
          ? "self-end !rounded-br-none bg-[--brand_color_400] border-transparent shadow-[--shadow_light_500]"
          : "!rounded-bl-none bg-[--bg_light_900] border-[--border_light_600] shadow-[--shadow_light_600]"
      } p-2 border shadow-md`}
    >
      <p
        className={`${
          chat.isMessageFromUser == "true"
            ? "text-[--text_light_700]"
            : "text-[--text_light_100]"
        } flex justify-start text-start text-sm`}
      >
        {chat.message} {date && <>&emsp;&emsp;&emsp;&emsp;</>}
      </p>
      {date && (
        <p
          className={`${
            chat.isMessageFromUser == "true"
              ? "text-[--text_light_500]"
              : "text-[--text_light_400]"
          } text-sm absolute right-1 bottom-1`}
        >{`${formatHours(date.getHours())}:${formatMinutes(
          date.getMinutes() + 2
        )} ${whichMeridian(date.getHours())}`}</p>
      )}
      {loadingMessage.find((el) => el.id == chat.id) && (
        <div className="absolute top-1 right-1 items-end justify-end">
          <Clock
            className="text-[--text_light_500]"
            width={13}
            height={13}
          ></Clock>
        </div>
      )}
    </div>
  );
}

function DateDivisor({ dateS }: { dateS: string }) {
  const date = new Date(dateS + " UTC");
  return (
    <div className={`relative my-2 flex w-full justify-center items-center`}>
      <div className="border-b w-[80%] absolute border-[--border_light_500]"></div>
      <p className="bg-[--bg_light_700] z-10 text-sm px-4 text-[--text_light_400]">{`${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`}</p>
    </div>
  );
}

export function Chat() {
  const [message, setMessage] = useState("");
  const {
    isChatOpen,
    setIsChatOpen,
    isInChat,
    setIsInChat,
    chat: chats,
    loadingChat,
    addMessageToChat,
    addLoadingMessage,
    removeLoadingMessage,
    addErrorMessage,
    notSeenMessages,
    setNotSeenMessagesToSeen,
  } = useChat();
  const { logged } = useAuth();
  const [currentQuestion, setCurrentQuestion] = useState("");

  const scrollChat = () => {
    const div = document.getElementById("chatBox");
    if (div) div.scrollTop = 9999;
  };

  useEffect(() => {
    scrollChat();
  }, [chats, isChatOpen]);

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const dateA = new Date();
    const date = new Date(
      dateA.getFullYear(),
      dateA.getMonth(),
      dateA.getDate(),
      dateA.getHours() + dateA.getTimezoneOffset() / 60,
      dateA.getMinutes() - 2,
      dateA.getSeconds()
    );

    const uuid = window.crypto.randomUUID();

    addMessageToChat({
      id: uuid,
      userId: "",
      isMessageFromUser: "true",
      message: message,
      created_at: `${formatDateTime(date)}`,
    } as ChatMessage);

    addLoadingMessage({ id: uuid });

    setMessage("");

    try {
      const res = await sendMessageRequest(message);
      if (!res) return;
      if (res.status == 200) {
        console.log("Mensaje recibido");
      }
    } catch (error) {
      console.log(error);
      addErrorMessage({ id: uuid });
    } finally {
      removeLoadingMessage({ id: uuid });
    }
  };

  const messageCards = useCallback(() => {
    return chats.map((c, i, arr) => {
      if (i == 0) {
        return (
          <>
            <DateDivisor dateS={`${new Date(c.created_at)}`}></DateDivisor>
            <ChatMessageCard chat={c} key={"cht-" + c.id}></ChatMessageCard>
          </>
        );
      }
      const datePrev = new Date(arr[i - 1].created_at + " UTC").toDateString();
      const dateActual = new Date(arr[i].created_at + " UTC").toDateString();
      if (datePrev !== dateActual) {
        return (
          <>
            <DateDivisor dateS={arr[i].created_at}></DateDivisor>
            <ChatMessageCard chat={c} key={"cht-" + c.id}></ChatMessageCard>
          </>
        );
      }
      return <ChatMessageCard chat={c} key={"cht-" + c.id}></ChatMessageCard>;
    });
  }, [chats]);

  return (
    <div
      className={`${
        logged ? "fixed" : "hidden"
      } bottom-0 right-0 mr-4 mb-[5.6rem] w-[90%] sm:w-auto z-50`}
    >
      <div
        className={`${
          isChatOpen && ""
        } flex items-end flex-col w-full sm:w-[26.5rem] gap-2 rounded-lg`}
      >
        <div
          className={`${
            isChatOpen ? "flex border border-[--border_light_500]" : "hidden"
          } flex-col bg-[--bg_light_900] rounded-lg overflow-hidden w-full h-[37.5rem] max-h-[37.5rem] shadow-m shadow-[--shadow_light_600]`}
        >
          <div
            className={`flex w-full border-b border-[--border_light_600] rounded-t-md h-12 items-center justify-center gap-3 p-2`}
          >
            <button
              className={`${
                isInChat ? "bg-[--bg_light_600]" : "hover:bg-[--bg_light_600]"
              } flex flex-row justify-center items-center gap-1 rounded-md px-3 py-1 text-sm font-medium`}
              onClick={() => setIsInChat(true)}
            >
              <MessageSquareMoreIcon className="w-4 h-4"></MessageSquareMoreIcon>
              Chat
            </button>
            <button
              className={`${
                isInChat ? "hover:bg-[--bg_light_600]" : "bg-[--bg_light_600]"
              } flex flex-row justify-center items-center gap-1 rounded-md px-3 py-1 text-sm font-medium`}
              onClick={() => setIsInChat(false)}
            >
              <HelpCircleIcon className="w-4 h-4"></HelpCircleIcon>Help
            </button>
          </div>
          <div
            className={`${
              isInChat ? "flex" : "hidden"
            } h-full bg-[--bg_light_700] flex-col p-3 max-h-full overflow-auto gap-2 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-[--bg_light_600] [&::-webkit-scrollbar-thumb]:rounded-md`}
            id="chatBox"
          >
            <ChatMessageCard
              chat={{
                id: "welcomeM",
                userId: "admin",
                isMessageFromUser: "false",
                message:
                  "Comienza una conversación con nosotros y cuentanos si tienes algun problema",
                created_at: "null",
              }}
              key={"cht-" + "welcomeChat"}
            ></ChatMessageCard>
            {loadingChat ? (
              <div className="flex justify-center items-center text-lg">
                <CircleDashed className="loader h-6 w-6"></CircleDashed>{" "}
                <span className="ml-1">Cargando chat...</span>
              </div>
            ) : (
              messageCards()
            )}
          </div>
          <div
            className={`${
              isInChat ? "hidden" : "flex"
            } h-full flex-col p-3 max-h-full overflow-auto gap-2 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-[--bg_light_500] [&::-webkit-scrollbar-thumb]:rounded-md`}
          >
            <DropDownTab
              id="metodos"
              question="¿Qué métodos de pago aceptan?"
              answer="Actualmente los pagos se realizan a travéz de la plataforma de pagos Tropipay que acepta pagos con Visa, MasterCard y saldo de Tropipay"
              currentQuestion={currentQuestion}
              setCurrentQuestion={setCurrentQuestion}
            ></DropDownTab>
            <DropDownTab
              id="formato"
              question="¿En qué formato están disponibles los modelos 3D?"
              answer="Los modelos se entregan en formato stl"
              currentQuestion={currentQuestion}
              setCurrentQuestion={setCurrentQuestion}
            ></DropDownTab>
            <DropDownTab
              id="resolucion"
              question="¿Se incluyen archivos en diferentes resoluciones o tamaños?"
              answer="No, el modelo esta en una sola resolucion y tamaño"
              currentQuestion={currentQuestion}
              setCurrentQuestion={setCurrentQuestion}
            ></DropDownTab>
            <DropDownTab
              id="comoDescargar"
              question="¿Cómo descargo un modelo después de comprarlo?"
              answer="En tu perfil estan todos los modelos que has comprado"
              currentQuestion={currentQuestion}
              setCurrentQuestion={setCurrentQuestion}
            ></DropDownTab>
            <DropDownTab
              id="tiempo"
              question="¿Cuánto tiempo tengo para descargar un modelo después de la compra?"
              answer="No tienes un tiempo limitado, una vez comprado lo puedes descargar en cualquier momento en tu perfil"
              currentQuestion={currentQuestion}
              setCurrentQuestion={setCurrentQuestion}
            ></DropDownTab>
            <DropDownTab
              id="variasDescargas"
              question="¿Puedo descargar el modelo más de una vez?"
              answer="Si, puedes descargar los modelos que has comprado cuantas veces quieras"
              currentQuestion={currentQuestion}
              setCurrentQuestion={setCurrentQuestion}
            ></DropDownTab>
            <DropDownTab
              id="problemaAlDescargar"
              question="¿Qué hago si tengo problemas para descargar mi archivo?"
              answer="Escribenos en el chat incorporado en la pestaña de chat o escribenos un correo a asd@gmail.com e intentaremos solucionar su problema"
              currentQuestion={currentQuestion}
              setCurrentQuestion={setCurrentQuestion}
            ></DropDownTab>
          </div>

          <div
            className={`w-full bg-[--bg_light_700] ${
              isInChat ? "flex" : "hidden"
            } h-16 px-3 pb-3 items-center`}
          >
            <form
              className="flex h-full w-full shadow-md shadow-[--shadow_light_500] rounded-lg overflow-hidden border border-[--bg_light_500]"
              onSubmit={handleChatSubmit}
            >
              <div className="flex w-full">
                <input
                  type="text"
                  name="message"
                  id="message"
                  autoComplete="off"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full rounded-l-lg focus:z-30 focus:outline-none border-0 focus:border focus:border-[--brand_color_400] text-md p-1 px-2 bg-[--bg_light_900]"
                  placeholder="Escribe algo..."
                />
                <button
                  className={`h-full w-12 flex justify-center items-center text-[--text_light_0] ${
                    message == undefined
                      ? "hover:text-[--text_light_500]"
                      : "hover:text-[--brand_color] hover:bg-[--brand_color_800]"
                  }`}
                >
                  <Send className="flex justify-center items-center w-7 h-7"></Send>
                </button>
              </div>
            </form>
          </div>
        </div>
        <div
          className={`absolute border-2 -bottom-[4.6rem] right-0 border-transparent bg-[--button] w-16 h-16 rounded-full flex justify-center items-center transition-transform`}
          onClick={() => {
            setIsChatOpen(!isChatOpen);
            setNotSeenMessagesToSeen();
          }}
        >
          {notSeenMessages > 0 && !isChatOpen && (
            <div className="absolute -top-3 right-0 rounded-full w-6 h-6 bg-[--brand_color] border border-[--bg_prim]">
              <div className="w-full h-full flex justify-center items-center text-[--text_light_900]">
                {notSeenMessages}
              </div>
            </div>
          )}
          <MessageSquareIcon
            className={`absolute w-10 h-10 transition-[opacity] ${
              isChatOpen ? "opacity-0 rotate-0" : "opacity-1 -rotate-12"
            }`}
            fill="#fff"
          ></MessageSquareIcon>

          <X
            className={`absolute text-[--text_light_900] w-10 h-10 transition-[opacity] ${
              isChatOpen ? "opacity-1 rotate-0" : " opacity-0 -rotate-12"
            }`}
          ></X>
        </div>
      </div>
    </div>
  );
}
