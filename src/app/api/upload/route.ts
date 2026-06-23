import { NextResponse, type NextRequest } from "next/server";
import { getAuthSession, handleApiError } from "@/lib/auth-guard";
import { uploadImage, R2_FOLDERS } from "@/lib/r2";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB (images)
const RESUME_TYPE = "application/pdf";
const RESUME_MAX_SIZE = 10 * 1024 * 1024; // 10MB (resumes)

export async function POST(request: NextRequest) {
  try {
    const { profileId } = await getAuthSession();

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const folder = formData.get("folder") as string | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (
      !folder ||
      !R2_FOLDERS.includes(folder as (typeof R2_FOLDERS)[number])
    ) {
      return NextResponse.json(
        { error: "Invalid folder. Allowed: projects, avatars, resumes" },
        { status: 400 }
      );
    }

    if (folder === "resumes") {
      if (file.type !== RESUME_TYPE) {
        return NextResponse.json(
          { error: "Invalid file type. Allowed: PDF" },
          { status: 400 }
        );
      }
      if (file.size > RESUME_MAX_SIZE) {
        return NextResponse.json(
          { error: "File too large. Maximum 10MB" },
          { status: 400 }
        );
      }
    } else {
      if (!ALLOWED_TYPES.includes(file.type)) {
        return NextResponse.json(
          { error: "Invalid file type. Allowed: JPEG, PNG, WebP, GIF" },
          { status: 400 }
        );
      }
      if (file.size > MAX_SIZE) {
        return NextResponse.json(
          { error: "File too large. Maximum 5MB" },
          { status: 400 }
        );
      }
    }

    const ext = file.name.split(".").pop() ?? "jpg";
    const key = `${folder}/${profileId}/${Date.now()}.${ext}`;
    const buffer = Buffer.from(await file.arrayBuffer());

    const url = await uploadImage(key, buffer, file.type);

    return NextResponse.json({ url }, { status: 201 });
  } catch (err) {
    return handleApiError(err);
  }
}
