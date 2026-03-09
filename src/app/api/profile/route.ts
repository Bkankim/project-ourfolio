import { NextResponse, type NextRequest } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { profiles } from "@/db/schema";
import { eq, and, ne } from "drizzle-orm";
import { updateProfileSchema } from "@/lib/validations";
import { getAuthSession, handleApiError } from "@/lib/auth-guard";

export async function GET() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  const existing = await db
    .select()
    .from(profiles)
    .where(eq(profiles.userId, userId))
    .limit(1);

  if (existing.length > 0) {
    return NextResponse.json({ profile: existing[0] });
  }

  // Auto-create profile on first login
  const [newProfile] = await db
    .insert(profiles)
    .values({
      userId,
      fullName: session.user.name ?? null,
      avatarUrl: session.user.image ?? null,
    })
    .returning();

  return NextResponse.json({ profile: newProfile });
}

export async function PATCH(request: NextRequest) {
  try {
    const { profile } = await getAuthSession();

    const body = await request.json();
    const parsed = updateProfileSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", issues: parsed.error.issues },
        { status: 400 }
      );
    }

    // Username uniqueness check
    if (parsed.data.username) {
      const [existing] = await db
        .select({ id: profiles.id })
        .from(profiles)
        .where(
          and(
            eq(profiles.username, parsed.data.username),
            ne(profiles.id, profile.id)
          )
        )
        .limit(1);

      if (existing) {
        return NextResponse.json(
          { error: "Username already taken" },
          { status: 409 }
        );
      }
    }

    const [updated] = await db
      .update(profiles)
      .set({ ...parsed.data, updatedAt: new Date() })
      .where(eq(profiles.id, profile.id))
      .returning();

    return NextResponse.json({ profile: updated });
  } catch (err) {
    return handleApiError(err);
  }
}
