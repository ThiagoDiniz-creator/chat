import ChatWithUserChatsAndUsers from "@/interfaces/ChatWithUserChatsAndUsers";
import { getImageFullUrl } from "@/libs/image";
import Chat from "@/models/chatModel";
import Message from "@/models/messageModel";
import UserChat from "@/models/userChatModel";
import User from "@/models/userModel";
import { headers } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { Op } from "sequelize";

export default async function HomePage() {
  const headersList = headers();
  const id = headersList.get("x-user-id");
  const profile = await User.findByPk(id ?? "");
  const chats = await getChats(id ?? "");

  return (
    <div className='bg-gray-900 text-white min-h-screen p-8'>
      <h1 className='text-3xl mb-4'>Welcome, {profile?.username}!</h1>
      <div className='mt-8'>
        <p className='text-lg mb-4'>Your Chats</p>
        <ul className='flex flex-col gap-y-3'>
          {chats.length === 0 ? (
            <p>Sem conversas</p>
          ) : (
            chats.map(chat => {
              if (id === null) return;
              const [userChatA, userChatB] = chat.UserChats;
              const otherUser =
                userChatA.User.idUser === +id ? userChatB : userChatA;
              const otherUserChat =
                userChatA.User.idUser !== +id ? userChatB : userChatA;

              return (
                <Link href={`/chat/${otherUser.User.idUser}`} key={chat.idChat}>
                  <li className='mb-2 flex items-center space-x-1 border border-neutral-800 px-4 py-2 relative'>
                    {otherUser.User.profilePicture ? (
                      <Image
                        src={getImageFullUrl(otherUser.User.profilePicture)}
                        alt={otherUser.User.username}
                        className='w-10 h-10 rounded-full inline-block mr-2'
                        width={48}
                        height={48}
                      />
                    ) : (
                      <div className='w-8 h-8 rounded-full inline-block mr-2 bg-gray-800' />
                    )}
                    <div className='flex flex-col'>
                      <span className='text-blue-500 hover:underline'>
                        Conversar com {otherUserChat.nameForUser}
                      </span>
                      {chat.lastMessage !== null && (
                        <span className='text-gray-400 text-sm'>
                          {chat.lastMessage.content}
                        </span>
                      )}
                    </div>
                    {chat.unreadMessages > 0 && (
                      <div className='absolute top-50 right-4'>
                        <span className='text-red-500 text-base  w-6 flex items-center justify-center bg-neutral-50 font-bold h-6 rounded-full border'>
                          {chat.unreadMessages}
                        </span>
                      </div>
                    )}
                  </li>
                </Link>
              );
            })
          )}
        </ul>
        <button className='mt-4'>
          <Link
            href='/chat'
            className='bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded focus:outline-none focus:shadow-outline-blue active:bg-blue-800'
          >
            Nova conversa
          </Link>
        </button>
      </div>
    </div>
  );
}

export async function getChats(idUser: string) {
  const userChats = await UserChat.findAll({
    where: {
      idUser,
    },
  });
  const chats = (await Chat.findAll({
    where: {
      idChat: {
        [Op.in]: userChats.map(userChat => userChat.idChat),
      },
    },
    include: [
      {
        model: UserChat,
        as: "UserChats",
        include: [
          {
            model: User,
            as: "User",
          },
        ],
      },
    ],
    order: [["idChat", "DESC"]],
  })) as ChatWithUserChatsAndUsers[];
  const chatsWithMessages = await Promise.all(
    chats.map(async chat => {
      const lastMessage = await Message.findOne({
        where: {
          idChat: chat.idChat,
        },
        order: [["sent", "DESC"]],
        limit: 1,
      });
      const unreadMessages = await Message.count({
        where: {
          idChat: chat.idChat,
          idUser: {
            [Op.not]: idUser,
          },
          status: {
            [Op.not]: "SEEN",
          },
        },
      });

      return {
        ...chat.dataValues,
        lastMessage,
        unreadMessages,
      };
    })
  );

  return chatsWithMessages as unknown as (ChatWithUserChatsAndUsers & {
    lastMessage: Message;
    unreadMessages: number;
  })[];
}
