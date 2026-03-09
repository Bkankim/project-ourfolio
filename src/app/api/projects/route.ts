import { NextResponse, type NextRequest } from "next/server";
import { getAuthSession, handleApiError } from "@/lib/auth-guard";
import { db } from "@/db";
import { projects } from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import { createProjectSchema } from "@/lib/validations";
import { parseLimit } from "@/lib/utils";

export async function GET(request: Request) {
  try {
    const { profileId } = await getAuthSession();
    const limit = parseLimit(request.url);

    const result = await db
      .select()
      .from(projects)
      .where(eq(projects.profileId, profileId))
      .orderBy(asc(projects.displayOrder))
      .limit(limit);

    return NextResponse.json({ projects: result });
  } catch (err) {
    return handleApiError(err);
  }
}

export async function POST(request: NextRequest) {
  try {
    const { profileId } = await getAuthSession();
    const body = await request.json();
    const parsed = createProjectSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", issues: parsed.error.issues },
        { status: 400 }
      );
    }

    const [project] = await db
      .insert(projects)
      .values({ ...parsed.data, profileId })
      .returning();

    return NextResponse.json({ project }, { status: 201 });
  } catch (err) {
    return handleApiError(err);
  }
}
