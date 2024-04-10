import getDataFromToken from "@/helpers/getDataFromToken";
import Message from "@/models/messageModel";
import UserChat from "@/models/userChatModel";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
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

  const messages = await Message.findAll({
    where: {
      idChat,
    },
    order: [["sent", "DESC"]],
    limit: 50,
  });

  return NextResponse.json({ messages: messages.reverse() });
}

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

  const { message } = (await request.json()) as { message: string | undefined };
  if (message === undefined) {
    return NextResponse.json({ error: "No message provided" }, { status: 400 });
  }

  const newMessage = await Message.create({
    idChat: +idChat,
    idUser: +id,
    content: message,
    sent: new Date(),
    status: "SENT",
  });

  return NextResponse.json({ message: newMessage });
}