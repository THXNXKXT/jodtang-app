import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { LandingContent } from "@/components/landing/landing-content";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "จดตัง — Jodtang",
  applicationCategory: "FinanceApplication",
  operatingSystem: "Web",
  description: "แอปจดบันทึกรายรับรายจ่ายที่ง่ายและน่ารัก สรุปยอดส่ง LINE ทุกเช้า",
  inLanguage: "th-TH",
  offers: { "@type": "Offer", price: "0", priceCurrency: "THB" },
};

// ponytail: root = landing for visitors, redirect to /home for authed users
export default async function RootPage() {
  const h = await headers();
  const cookie = h.get("cookie") ?? "";
  const hasSession = cookie.includes("better-auth.session_token");

  if (hasSession) redirect("/home");
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <LandingContent />
    </>
  );
}
