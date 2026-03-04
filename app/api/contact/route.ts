import { NextResponse } from "next/server";
import { contactSchema } from "@/lib/validations/contact-schema";

export async function POST(req: Request) {
  const body = await req.json();

  const parsed = contactSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }

  const { name, email, phone, message } = parsed.data;

  // TODO: Send email here (Resend or Nodemailer)

  console.log("New Contact:", { name, email, phone, message });

  return NextResponse.json({ success: true });
}
