import { NextResponse } from "next/server";
import { db } from "@/db";
import { consents } from "@/db/schema";
import { consentRecordSchema } from "@/lib/validations";
import { getAuthUser, handleApiError } from "@/lib/auth-guard";

export async function POST(request: Request) {
  try {
    const { userId } = await getAuthUser();

    const body = await request.json();
    const parsed = consentRecordSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", issues: parsed.error.issues },
        { status: 400 },
      );
    }

    const values = parsed.data.consents.map((c) => ({
      userId,
      consentType: c.type,
      policyVersion: c.policyVersion,
    }));

    await db.insert(consents).values(values);

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (err) {
    return handleApiError(err);
  }
}
