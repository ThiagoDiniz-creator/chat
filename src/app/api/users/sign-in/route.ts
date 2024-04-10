import { signJwt } from "@/libs/auth";
import User from "@/models/userModel";
import { compare } from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { email, password } = await request.json();
  console.log(email, password);

  if (!email || !password) {
    NextResponse.json(
      { error: "Email e senha são obrigatórios" },
      { status: 400 }
    );
  }

  const user = await User.findOne({ where: { email } });
  if (user === null) {
    return NextResponse.json(
      { error: "Usuário não encontrado" },
      { status: 404 }
    );
  }

  const passwordMatch = await compare(password, user.password);

  if (!passwordMatch) {
    return NextResponse.json(
      { error: "Usuário não encontrado" },
      { status: 404 }
    );
  }

  const res = NextResponse.json(
    { user: { ...user.dataValues, password: undefined }, success: true },
    { status: 200 }
  );
  const token = await signJwt({ id: user.idUser });
  res.cookies.set("token", token, {
    domain: "192.168.1.121",
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });

  return res;
}
