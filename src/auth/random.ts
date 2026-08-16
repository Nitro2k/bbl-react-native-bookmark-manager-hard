import * as Crypto from "expo-crypto";

export async function generateRandomHexKey(byteCount: number): Promise<string> {
  const bytes = await Crypto.getRandomBytesAsync(byteCount);
  return Array.from(bytes)
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}
