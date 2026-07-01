import { headers } from "next/headers";
import { auth } from "./auth";

export async function getSession() {
  return auth.api.getSession({ headers: await headers() });
}

export async function requireUserId(): Promise<string> {
  const session = await getSession();
  if (!session?.user) throw new Error("Unauthorized");
  return session.user.id;
}
