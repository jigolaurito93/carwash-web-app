import type { NextConfig } from "next";

function supabaseStorageHostname() {
  try {
    return new URL(process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").hostname;
  } catch {
    return "*.supabase.co";
  }
}

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: supabaseStorageHostname() || "*.supabase.co",
        pathname: "/storage/v1/object/public/gallery/**",
      },
    ],
  },
};

export default nextConfig;
