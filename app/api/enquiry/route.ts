import { NextResponse } from "next/server";
import { Resend } from "resend";
import { enquirySchema } from "@/lib/validation/enquiry";
import { siteConfig } from "@/lib/seo/site";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = enquirySchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Invalid submission", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { ok: false, error: "Email delivery is not configured yet.", fallback: true },
      { status: 503 },
    );
  }

  const { name, email, phone, interest, message } = parsed.data;
  const resend = new Resend(apiKey);

  try {
    await resend.emails.send({
      from: `${siteConfig.name} Website <onboarding@resend.dev>`,
      to: siteConfig.email,
      replyTo: email,
      subject: `New enquiry from ${name}${interest ? ` — ${interest}` : ""}`,
      text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nInterest: ${interest ?? "—"}\n\n${message}`,
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: "Could not send your enquiry. Please try again." }, { status: 502 });
  }
}
