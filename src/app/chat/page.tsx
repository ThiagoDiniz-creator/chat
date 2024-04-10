import UserChat from "@/models/userChatModel";
import User from "@/models/userModel";
import { headers } from "next/headers";
import Link from "next/link";
import { Op } from "sequelize";

export default async function ChatPage() {
  const currentHeaders = headers();
  const id = currentHeaders.get("x-user-id");
  const users = await getUsers(id ?? "");

  return (
    <div className='bg-gray-900 text-white min-h-screen p-8'>
      <h1 className='text-4xl font-bold mb-6'>Chat</h1>
      <p>This is the chat page.</p>

      <h2 className='text-2xl mt-8 mb-4'>Users</h2>
      <ul className='flex flex-wrap'>
        {users.map(user => (
          <li
            key={user.idUser}
            className='bg-blue-600 px-8 py-6 mb-4 mr-4 rounded'
          >
            <Link
              href={`/chat/${user.idUser}`}
              className='flex flex-col text-white'
            >
              <span className='text-lg font-bold mb-2'>{user.username}</span>
              <span className='text-sm'>{user.email}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export async function getUsers(idUser: string) {
  const users = await User.findAll({
    where: { idUser: { [Op.ne]: idUser } },
    include: [
      {
        model: UserChat,
        where: {
          idUser: {
            [Op.ne]: idUser,
          },
        },
      },
    ],
  });
  return users;
}
