import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Complete profile | Onyx Premium Carwash",
  description: "Complete your Onyx admin profile to access the CMS.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
