import { NextResponse } from "next/server";
import { getAuthUser, handleApiError } from "@/lib/auth-guard";
import { getGithubToken, fetchUserRepos } from "@/lib/github";

export async function GET() {
  try {
    const { userId } = await getAuthUser();

    const token = await getGithubToken(userId);
    if (!token) {
      return NextResponse.json(
        { error: "GitHub not connected" },
        { status: 400 }
      );
    }

    const repos = await fetchUserRepos(token);
    return NextResponse.json({ repos });
  } catch (err) {
    return handleApiError(err);
  }
}
