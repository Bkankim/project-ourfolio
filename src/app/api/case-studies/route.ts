import { NextResponse, type NextRequest } from "next/server";
import { getAuthSession, handleApiError } from "@/lib/auth-guard";
import { db } from "@/db";
import { caseStudies } from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import { createCaseStudySchema } from "@/lib/validations";
import { parseLimit } from "@/lib/utils";

export async function GET(request: Request) {
  try {
    const { profileId } = await getAuthSession();
    const limit = parseLimit(request.url);

    const result = await db
      .select()
      .from(caseStudies)
      .where(eq(caseStudies.profileId, profileId))
      .orderBy(asc(caseStudies.displayOrder))
      .limit(limit);

    return NextResponse.json({ caseStudies: result });
  } catch (err) {
    return handleApiError(err);
  }
}

export async function POST(request: NextRequest) {
  try {
    const { profileId } = await getAuthSession();
    const body = await request.json();
    const parsed = createCaseStudySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", issues: parsed.error.issues },
        { status: 400 }
      );
    }

    const [caseStudy] = await db
      .insert(caseStudies)
      .values({ ...parsed.data, profileId })
      .returning();

    return NextResponse.json({ caseStudy }, { status: 201 });
  } catch (err) {
    return handleApiError(err);
  }
}
