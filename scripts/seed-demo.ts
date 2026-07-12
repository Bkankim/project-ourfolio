/**
 * Demo data seed — creates a public read-only "demo" profile with sample projects.
 *
 * Usage: pnpm db:seed
 *
 * Idempotent: profile is upserted on profiles.user_id, projects are upserted
 * on fixed UUIDs. Running twice produces no duplicates.
 *
 * Production guard: refuses to run against a non-localhost database host
 * (e.g. *.neon.tech) unless SEED_ALLOW_PROD is set.
 */
import { readFileSync } from "node:fs";
import { neon } from "@neondatabase/serverless";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/neon-http";
import { profiles, projects } from "../src/db/schema";

const DEMO_USER_ID = "demo-user";
const DEMO_USERNAME = "demo";

// Fixed UUIDs so re-runs upsert instead of duplicating.
const DEMO_PROJECT_IDS = [
  "6f000000-0000-4000-8000-000000000001",
  "6f000000-0000-4000-8000-000000000002",
  "6f000000-0000-4000-8000-000000000003",
] as const;

function loadEnvFile(path: string): void {
  let raw: string;
  try {
    raw = readFileSync(path, "utf8");
  } catch {
    return;
  }
  for (const line of raw.split("\n")) {
    const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
    if (!match) continue;
    const key = match[1];
    let value = match[2];
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (process.env[key] === undefined) process.env[key] = value;
  }
}

function assertSafeTarget(databaseUrl: string): void {
  if (process.env.SEED_ALLOW_PROD) return;
  let host: string;
  try {
    host = new URL(databaseUrl).hostname;
  } catch {
    console.error("seed-demo: DATABASE_URL is not a valid URL.");
    process.exit(1);
  }
  const isLocal =
    host === "localhost" || host === "127.0.0.1" || host === "::1" || host.endsWith(".local");
  if (!isLocal) {
    console.error(
      `seed-demo: refusing to seed non-local database host "${host}".\n` +
        "Set SEED_ALLOW_PROD=1 to override (make sure you know what you are doing).",
    );
    process.exit(1);
  }
}

async function main(): Promise<void> {
  loadEnvFile(".env.local");
  loadEnvFile(".env");

  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error("seed-demo: DATABASE_URL is not set.");
    process.exit(1);
  }
  assertSafeTarget(databaseUrl);

  const db = drizzle(neon(databaseUrl));

  // Never hijack a real user's "demo" username.
  const existing = await db
    .select({ userId: profiles.userId })
    .from(profiles)
    .where(eq(profiles.username, DEMO_USERNAME));
  if (existing.length > 0 && existing[0].userId !== DEMO_USER_ID) {
    console.error(
      `seed-demo: username "${DEMO_USERNAME}" is already taken by user "${existing[0].userId}". Aborting.`,
    );
    process.exit(1);
  }

  const [profile] = await db
    .insert(profiles)
    .values({
      userId: DEMO_USER_ID,
      username: DEMO_USERNAME,
      fullName: "Dana Demo",
      tagline: "Full-stack developer who ships evidence-based work",
      profession: "Full-stack Developer",
      bio: "This is a read-only demo profile showcasing what an OurFolio portfolio looks like. Projects, case studies, and metrics below are sample data.",
      skills: ["TypeScript", "React", "Next.js", "PostgreSQL", "Tailwind CSS"],
      socialLinks: { github: "https://github.com/vercel/next.js" },
    })
    .onConflictDoUpdate({
      target: profiles.userId,
      set: {
        username: DEMO_USERNAME,
        updatedAt: new Date(),
      },
    })
    .returning({ id: profiles.id });

  const demoProjects = [
    {
      id: DEMO_PROJECT_IDS[0],
      title: "Realtime Analytics Dashboard",
      description:
        "Problem: ops team flew blind between daily reports. Solution: streaming dashboard with sub-second aggregation. Result: incident detection time cut from hours to minutes.",
      category: "Web App",
      tags: ["analytics", "realtime"],
      stack: ["Next.js", "PostgreSQL", "WebSocket"],
      role: "Lead Developer",
      featured: true,
      displayOrder: 0,
    },
    {
      id: DEMO_PROJECT_IDS[1],
      title: "Headless Commerce Storefront",
      description:
        "Problem: legacy storefront limited conversion experiments. Solution: headless rebuild with edge rendering. Result: 38% faster LCP and +12% checkout conversion.",
      category: "E-commerce",
      tags: ["commerce", "performance"],
      stack: ["Next.js", "Stripe", "Tailwind CSS"],
      role: "Frontend Engineer",
      featured: true,
      displayOrder: 1,
    },
    {
      id: DEMO_PROJECT_IDS[2],
      title: "Open Source CLI Toolkit",
      description:
        "Problem: repetitive project scaffolding across teams. Solution: a plugin-based CLI generator. Result: onboarding time for new services dropped from days to under an hour.",
      category: "Open Source",
      tags: ["cli", "devtools"],
      stack: ["TypeScript", "Node.js"],
      role: "Maintainer",
      featured: false,
      displayOrder: 2,
    },
  ];

  for (const project of demoProjects) {
    await db
      .insert(projects)
      .values({ ...project, profileId: profile.id })
      .onConflictDoUpdate({
        target: projects.id,
        set: {
          profileId: profile.id,
          title: project.title,
          description: project.description,
          category: project.category,
          tags: project.tags,
          stack: project.stack,
          role: project.role,
          featured: project.featured,
          displayOrder: project.displayOrder,
        },
      });
  }

  console.log(
    `seed-demo: upserted profile "${DEMO_USERNAME}" (${profile.id}) with ${demoProjects.length} projects.`,
  );
}

main().catch((error) => {
  console.error("seed-demo: failed:", error);
  process.exit(1);
});
