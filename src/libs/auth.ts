import { SignJWT, jwtVerify } from "jose";

export function getSecretKey() {
  const secretKey = process.env.JWT_SECRET_KEY!;
  return new TextEncoder().encode(secretKey);
}

export async function signJwt(payload: Record<string, unknown>) {
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1d")
    .sign(getSecretKey());

  return token;
}

export async function verifyJwt(token: string) {
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    return payload;
  } catch (err: any) {
    return null;
  }
}
