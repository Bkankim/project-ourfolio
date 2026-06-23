import { ImageResponse } from "next/og";
import { db } from "@/db";
import { profiles } from "@/db/schema";
import { eq } from "drizzle-orm";

export const alt = "Portfolio — OurFolio";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;

  const [profile] = await db
    .select({
      fullName: profiles.fullName,
      tagline: profiles.tagline,
      skills: profiles.skills,
      primaryColor: profiles.primaryColor,
    })
    .from(profiles)
    .where(eq(profiles.username, username))
    .limit(1);

  const name = profile?.fullName ?? username;
  const tagline = profile?.tagline ?? "";
  const skills = (profile?.skills ?? []).slice(0, 6);
  const primary = profile?.primaryColor ?? "#3B82F6";

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "90px",
          background: "#0a0a0a",
          color: "#ffffff",
        }}
      >
        <div
          style={{ display: "flex", width: 140, height: 10, background: primary, marginBottom: 48 }}
        />
        <div style={{ fontSize: 76, fontWeight: 700, lineHeight: 1.1 }}>{name}</div>
        {tagline ? (
          <div style={{ fontSize: 38, color: "#a3a3a3", marginTop: 20 }}>{tagline}</div>
        ) : null}
        {skills.length > 0 ? (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 16, marginTop: 48 }}>
            {skills.map((s) => (
              <div
                key={s}
                style={{
                  display: "flex",
                  fontSize: 26,
                  color: primary,
                  border: `2px solid ${primary}`,
                  borderRadius: 9999,
                  padding: "10px 28px",
                }}
              >
                {s}
              </div>
            ))}
          </div>
        ) : null}
        <div
          style={{
            display: "flex",
            position: "absolute",
            bottom: 64,
            right: 90,
            fontSize: 30,
            color: "#737373",
          }}
        >
          OurFolio
        </div>
      </div>
    ),
    { ...size }
  );
}
