// app/api/contact/route.ts
import { NextResponse } from "next/server";
import { contactSchema } from "@/lib/validations/contact-schema";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = contactSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }

  const { name, email, phone, message } = parsed.data;

  try {
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: process.env.OWNER_EMAIL!,
      subject: `New Inquiry from ${name}`,
      html: `
        <h2>New Inquiry from Your Car Wash Website</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || "Not provided"}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { error: "Failed to send inquiry" },
      { status: 500 },
    );
  }
}
