import getDataFromToken from "@/helpers/getDataFromToken";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const data = await getDataFromToken(
    request.cookies.get("token")?.value ?? ""
  );
  if (data === null) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
  const user = await User.findByPk(data.id);
  if (user === null) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
  return NextResponse.json({ user });
}
