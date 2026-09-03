import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create password | Onyx Premium Carwash",
  description: "Set a password for your Onyx admin account.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function SetPasswordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
