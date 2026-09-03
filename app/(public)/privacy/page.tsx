import type { Metadata } from "next";
import LegalPage from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: "Privacy Policy | Onyx Premium Carwash",
  description:
    "How Onyx Hand Premium Wash collects, uses, and protects the information you share through this website.",
};

export default function PrivacyPage() {
  return <LegalPage slug="privacy" />;
}
