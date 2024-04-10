import getDataFromToken from "@/helpers/getDataFromToken";
import Message from "@/models/messageModel";
import UserChat from "@/models/userChatModel";
import { NextRequest, NextResponse } from "next/server";
import { Op } from "sequelize";

export async function POST(
  request: NextRequest,
  { params: { id: idChat } }: { params: { id: string | null } }
) {
  if (idChat === null) {
    return NextResponse.json(
      { error: "There is no chat with this id" },
      { status: 404 }
    );
  }
  const data = await getDataFromToken(
    request.cookies.get("token")?.value ?? ""
  );
  if (data === null) {
    return NextResponse.json(
      { error: "There is no chat with this id" },
      { status: 404 }
    );
  }
  const { id } = data;
  const userChats = await UserChat.findOne({
    where: {
      idUser: id,
      idChat,
    },
  });
  if (userChats === null) {
    return NextResponse.json(
      { error: "There is no chat with this id" },
      { status: 404 }
    );
  }

  const messagesSeen = await Message.update(
    {
      status: "SEEN",
    },
    {
      where: {
        idChat,
        idUser: {
          [Op.not]: id,
        },
        status: {
          [Op.or]: ["SENT", "SERVER"],
        },
      },
    }
  );

  return NextResponse.json({ messagesSeen });
}
