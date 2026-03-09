import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/db";
import { analyticsEvents } from "@/db/schema";
import { trackEventSchema } from "@/lib/validations";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = trackEventSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed" },
      { status: 400 }
    );
  }

  try {
    await db.insert(analyticsEvents).values({
      profileId: parsed.data.profileId,
      eventType: parsed.data.eventType,
      visitorId: parsed.data.visitorId ?? null,
      metadata: parsed.data.metadata ?? {},
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch {
    // FK constraint violation = profile not found
    return NextResponse.json(
      { error: "Profile not found" },
      { status: 404 }
    );
  }
}
