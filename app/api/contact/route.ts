import { NextResponse } from "next/server";
import { contactSchema } from "@/lib/validations/contact-schema";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  const body = await req.json();

  const parsed = contactSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }

  const { name, email, phone, message } = parsed.data;

  // Insert into Supabase database
  const { error } = await supabase
    .from("contacts")
    .insert([{ name, email, phone, message }]);

  if (error) {
    console.error("Error inserting contact:", error);
    return NextResponse.json(
      { error: "Failed to save contact" },
      { status: 500 },
    );
  }

  console.log("New Contact saved:", { name, email, phone, message });

  return NextResponse.json({ success: true });
}
