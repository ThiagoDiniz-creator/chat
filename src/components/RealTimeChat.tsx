"use client";
import ESocketEvents from "@/enums/ESocketEvents";
import { ChatAttributes } from "@/models/chatModel";
import { MessageAttributes } from "@/models/messageModel";
import { Check, Checks } from "@phosphor-icons/react";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const GetStatusIcon = ({ status }: { status: "SENT" | "SERVER" | "SEEN" }) => {
  if (status === "SERVER") {
    return <Check className='text-white' size={14} />;
  }
  if (status === "SENT") {
    return <Checks className='text-white' size={14} />;
  }
  return <Checks className='text-gray-900' size={14} />;
};

const RealTimeChat = ({
  chat,
  previousMessages,
  idUser,
  chatName,
  imageUrl,
  ioUrl,
}: {
  chat: ChatAttributes;
  id: string;
  previousMessages: MessageAttributes[];
  idUser: string;
  chatName: string;
  imageUrl: string | null;
  ioUrl: string;
}) => {
  const [messages, setMessages] =
    useState<MessageAttributes[]>(previousMessages);
  const [isTyping, setIsTyping] = useState(false);
  const [amITyping, setAmITyping] = useState(false);
  const socket = useMemo(() => io(ioUrl, { withCredentials: true }), []);
  const messagesContainerRef = useRef<HTMLUListElement | null>(null);
  const messageRef = useRef<HTMLLIElement | null>(null);
  const typingRef = useRef<HTMLSpanElement | null>(null);
  const [formObject, setFormObject] = useState<{ content: string }>({
    content: "",
  });

  const refetchMessages = async () => {
    const response = await fetch(`/api/chat/${chat.idChat}/messages`);
    const data = await response.json();
    setMessages(data.messages);
    return data;
  };

  const handleScroll = () => {
    if (messagesContainerRef.current) {
      const isScrolledToBottom =
        messagesContainerRef.current.scrollTop +
          messagesContainerRef.current.clientHeight <
        messagesContainerRef.current.scrollHeight;

      if (!isScrolledToBottom) {
        if (typingRef.current !== null) {
          typingRef.current.scrollIntoView({ behavior: "smooth" });
        } else if (messageRef.current !== null) {
          messageRef.current.scrollIntoView({ behavior: "smooth" });
        }
      }
    }
  };

  const hasSeen = async () => {
    const response = await fetch(`/api/chat/${chat.idChat}/messages/seen`, {
      method: "POST",
      credentials: "include",
    });

    const body = await response.json();
    if (response.status !== 200) {
      const errorMessage = body.message ?? "Mensagem não enviada";
      return toast.error(errorMessage);
    }

    socket.emit("VISUALIZED", chat.idChat);
  };

  useEffect(() => {
    handleScroll();
  }, [messages, isTyping]);

  useEffect(() => {
    socket.emit(ESocketEvents.JOIN, chat.idChat);
    hasSeen();

    socket.on(ESocketEvents.NEW_MESSAGE, () => {
      refetchMessages();
      hasSeen();
    });

    socket.on(ESocketEvents.TYPING, () => {
      setIsTyping(true);
    });

    socket.on(ESocketEvents.STOP_TYPING, () => {
      setIsTyping(false);
    });

    socket.on("VISUALIZED", () => {
      refetchMessages();
    });

    return () => {
      socket.emit("LEAVE_CHAT", chat.idChat);
    };
  }, []);

  const handleMessageSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (formObject.content === null || formObject.content.trim().length === 0) {
      return toast.error("Mensagem vazia");
    }

    try {
      const response = await fetch(`/api/chat/${chat.idChat}/messages`, {
        method: "POST",
        body: JSON.stringify({ message: formObject.content }),
        credentials: "include",
      });

      const body = await response.json();
      if (response.status !== 200) {
        const errorMessage = body.message ?? "Mensagem não enviada";
        return toast.error(errorMessage);
      }

      setMessages(prevMessages => [...prevMessages, body.message]);
      socket.emit("SEND_MESSAGE", chat.idChat);
      socket.emit("STOP_TYPING", chat.idChat);
      setFormObject({ content: "" });
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <div className='bg-gray-900 text-white p-8 flex flex-col min-h-[93vh] max-h-[93vh]'>
      <div className='flex flex-row space-x-4 items-center'>
        {imageUrl && (
          <Image
            src={imageUrl}
            alt='Profile Picture'
            objectFit='cover'
            className='rounded-full'
            width={60}
            height={60}
          />
        )}
        <h1 className='text-4xl font-bold'>{chatName}</h1>
      </div>
      <h2 className='text-2xl mt-4 mb-4'>Messages</h2>
      <div className='flex-1 overflow-y-scroll relative'>
        <ul className='flex flex-col space-y-2' ref={messagesContainerRef}>
          {messages.length === 0 ? (
            <p className='text-white'>No messages</p>
          ) : (
            messages.map(message => (
              <li
                key={message.idMessage}
                ref={messageRef}
                className={`flex items-end gap-x-3 px-4 py-2 w-fit transition ${
                  message.idUser === +idUser
                    ? "bg-blue-500 rounded-br-md rounded-tl-md self-end"
                    : "bg-neutral-200 rounded-bl-md rounded-tr-md"
                }`}
              >
                <span
                  className={`text-sm font-medium ${
                    message.idUser === +idUser
                      ? "text-white"
                      : "text-neutral-800"
                  }`}
                >
                  {message.content}
                </span>
                {message.idUser === +idUser && (
                  <span className='text-xs text-neutral-400'>
                    {GetStatusIcon({
                      ...message,
                    })}
                  </span>
                )}
              </li>
            ))
          )}
        </ul>
        {isTyping && (
          <span className='text-white list-none absolute z-10' ref={typingRef}>
            <span className='animate-ping'>•</span> {chatName} está digitando...
          </span>
        )}
      </div>

      <form onSubmit={handleMessageSubmit} className='mt-4 flex items-center'>
        <input
          className='border-2 px-4 py-2 w-full mr-4 rounded-md text-neutral-800'
          type='text'
          id='content'
          name='content'
          placeholder='Escreva sua mensagem'
          value={formObject.content}
          onChange={e => {
            setFormObject({ ...formObject, content: e.target.value });
            const trimmedValue = e.target.value.trim();
            if (trimmedValue.length > 0 && !amITyping) {
              socket.emit("TYPING", chat.idChat);
              setAmITyping(true);
            }
            if (trimmedValue.length === 0 && amITyping) {
              socket.emit("STOP_TYPING", chat.idChat);
              setAmITyping(false);
            }
          }}
        />
        <button className='bg-blue-500 px-4 py-2 rounded-lg' type='submit'>
          Enviar
        </button>
      </form>
    </div>
  );
};

export default RealTimeChat;
