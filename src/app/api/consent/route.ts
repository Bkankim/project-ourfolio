import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { consents } from "@/db/schema";
import { consentRecordSchema } from "@/lib/validations";

export async function POST(request: Request) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = consentRecordSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  const values = parsed.data.consents.map((c) => ({
    userId: session.user.id,
    consentType: c.type,
    policyVersion: c.policyVersion,
  }));

  await db.insert(consents).values(values);

  return NextResponse.json({ ok: true }, { status: 201 });
}
