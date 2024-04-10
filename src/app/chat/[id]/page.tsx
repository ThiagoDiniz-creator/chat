import RealTimeChat from "@/components/RealTimeChat";
import ChatWithUserChats from "@/interfaces/ChatWithUserChats";
import { getImageFullUrl } from "@/libs/image";
import Chat from "@/models/chatModel";
import Message from "@/models/messageModel";
import UserChat from "@/models/userChatModel";
import User from "@/models/userModel";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { Op } from "sequelize";

async function createChat(user: User, otherUser: User) {
  const newChat = await Chat.create({ lastActive: new Date() });
  await Promise.all([
    UserChat.create({
      idUser: Number(user.idUser),
      idChat: newChat.idChat,
      nameForUser: otherUser.username,
    }),
    UserChat.create({
      idUser: Number(otherUser.idUser),
      idChat: newChat.idChat,
      nameForUser: user.username,
    }),
  ]);
  return newChat;
}

async function getChat(userId: string, otherUserId: string) {
  const [user, otherUser] = await Promise.all([
    User.findByPk(userId),
    User.findByPk(otherUserId),
  ]);

  if (!user || !otherUser) {
    throw new Error("Invalid user or other user");
  }

  const chat = (await Chat.findAll({
    include: [
      {
        required: true,
        model: UserChat,
        where: {
          idUser: {
            [Op.in]: [userId, otherUserId],
          },
        },
      },
    ],
  })) as ChatWithUserChats[];
  const userChat = chat.find(chat => chat.UserChats.length === 2);

  if (!userChat) {
    return createChat(user, otherUser);
  }

  return userChat;
}

export default async function IndividualChatPage({
  params: { id: chatId },
}: {
  params: { id: string };
}) {
  const userId = headers().get("x-user-id");

  if (chatId === null || userId === null) {
    return NextResponse.redirect("/chat");
  }

  const [chat, otherUser] = await Promise.all([
    getChat(userId, chatId as string),
    User.findByPk(chatId),
  ]);

  if (chat === null || otherUser === null) {
    return NextResponse.redirect("/chat");
  }

  const messages = await Message.findAll({
    where: { idChat: chat.idChat },
    order: [["sent", "DESC"]],
    limit: 50,
    raw: true,
  });

  const imageUrl = otherUser?.profilePicture
    ? getImageFullUrl(otherUser.profilePicture)
    : null;

  return (
    <RealTimeChat
      chat={JSON.parse(JSON.stringify({ ...chat.dataValues }))}
      id={chatId}
      chatName={otherUser.username}
      previousMessages={messages.reverse()}
      idUser={userId}
      imageUrl={imageUrl}
      ioUrl={process.env.IO_URL!}
    />
  );
}
