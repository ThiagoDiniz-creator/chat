import { createWriteStream } from "@/libs/gcs";
import User from "@/models/userModel";
import { headers } from "next/headers";
import { NextFetchEvent, NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, ev: NextFetchEvent) {
  const userId = headers().get("x-user-id");
  if (!userId) {
    return NextResponse.json({ success: false });
  }
  const user = await User.findByPk(userId);
  if (!user) {
    return NextResponse.json({ success: false });
  }

  const formData = await req.formData();
  const file = formData.get("file") as File;
  if (!file) {
    return NextResponse.json({ success: false });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const filename = `${user.username}-${Date.now()}-profile-picture.png`;
  const writeStream = createWriteStream(filename, file.type);
  writeStream.write(buffer);
  writeStream.end();

  user.profilePicture = filename;
  await user.save();

  return NextResponse.json({ success: true });
}
