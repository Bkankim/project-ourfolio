import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { profiles } from "@/db/schema";
import { eq } from "drizzle-orm";

export class AuthError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export async function getAuthSession() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new AuthError("Unauthorized", 401);
  }

  const userId = session.user.id;

  const [profile] = await db
    .select()
    .from(profiles)
    .where(eq(profiles.userId, userId))
    .limit(1);

  if (!profile) {
    throw new AuthError("Profile not found", 404);
  }

  return {
    session,
    userId,
    profileId: profile.id,
    profile,
  };
}

export function handleApiError(err: unknown): NextResponse {
  if (err instanceof AuthError) {
    return NextResponse.json(
      { error: err.message },
      { status: err.status }
    );
  }
  return NextResponse.json(
    { error: "Internal server error" },
    { status: 500 }
  );
}
