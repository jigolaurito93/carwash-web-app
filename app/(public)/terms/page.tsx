import type { Metadata } from "next";
import LegalPage from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: "Terms of Service | Onyx Premium Carwash",
  description:
    "The terms that apply when you use the Onyx Hand Premium Wash website and services.",
};

export default function TermsPage() {
  return <LegalPage slug="terms" />;
}
