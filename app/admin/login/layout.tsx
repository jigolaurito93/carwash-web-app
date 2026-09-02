import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Login | Onyx Premium Carwash",
  description: "Sign in to the Onyx Premium Carwash admin portal.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
