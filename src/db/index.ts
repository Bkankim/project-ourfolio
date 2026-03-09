import { neon, NeonQueryFunction } from "@neondatabase/serverless";
import { drizzle, NeonHttpDatabase } from "drizzle-orm/neon-http";
import * as schema from "./schema";

function createDb(): NeonHttpDatabase<typeof schema> {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    // Return a proxy that throws on actual usage but allows module loading
    return new Proxy({} as NeonHttpDatabase<typeof schema>, {
      get(_, prop) {
        if (prop === "then" || prop === Symbol.toPrimitive) return undefined;
        throw new Error(
          `DATABASE_URL is not set. Cannot use db.${String(prop)}`
        );
      },
    });
  }
  const sql: NeonQueryFunction<false, false> = neon(connectionString);
  return drizzle(sql, { schema });
}

export const db = createDb();
