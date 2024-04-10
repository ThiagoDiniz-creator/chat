import User from "@/models/userModel";
import { hash } from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { email, password, username } = await request.json();

  if (!email || !password || !username) {
    return NextResponse.json(
      { error: "Email, senha e nome de usuário são obrigatórios" },
      { status: 400 }
    );
  }

  const user = await User.findOne({ where: { email } });
  if (user !== null) {
    return NextResponse.json({ error: "Email já cadastrado" }, { status: 400 });
  }

  const user2 = await User.findOne({ where: { username: username } });
  if (user2 !== null) {
    return NextResponse.json(
      { error: "Nome de usuário já cadastrado" },
      { status: 400 }
    );
  }

  const hashedPassword = await hash(password, 12);
  const newUser = await User.create({
    email,
    password: hashedPassword,
    username: username,
  });

  return NextResponse.json({ user: { ...newUser, password: undefined } });
}
