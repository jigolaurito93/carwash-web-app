import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/lib/database.types";

export const metadata = {
  title: "Admin",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createServerComponentClient<Database>({ cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    // redirect to login if no session
    // (we can't use next/navigation redirect in layout, so we render a script)
    return (
      <html>
        <head>
          <meta httpEquiv="refresh" content="0; url=/admin/login" />
        </head>
        <body />
      </html>
    );
  }

  return <>{children}</>;
}
