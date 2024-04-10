import { verifyJwt } from "@/libs/auth";

export default async function getDataFromToken(
  token: string
): Promise<{ id: string } | null> {
  const decoded = await verifyJwt(token);
  if (decoded === null) {
    return null;
  }
  return decoded as { id: string };
}
