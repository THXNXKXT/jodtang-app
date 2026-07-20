import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { LandingContent } from "@/components/landing/landing-content";

// ponytail: root = landing for visitors, redirect to /home for authed users
export default async function RootPage() {
  const h = await headers();
  const cookie = h.get("cookie") ?? "";
  const hasSession = cookie.includes("better-auth.session_token");

  if (hasSession) redirect("/home");
  return <LandingContent />;
}
