import { env } from "@/lib/env";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./db";
import * as schema from "./db/schema";
import { seedDefaultData } from "./actions/seed";

export const auth = betterAuth({
  secret: env.BETTER_AUTH_SECRET,
  baseURL: env.BETTER_AUTH_URL || "http://localhost:3000",
  trustedOrigins: [
    "http://localhost:3000",
    "https://jodtang-app.vercel.app",
    env.BETTER_AUTH_URL,
  ],
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: schema.users,
      session: schema.sessions,
      account: schema.accounts,
      verification: schema.verifications,
    },
  }),
  emailAndPassword: { enabled: true },
  // ponytail: better-auth hook — seed wallets + categories once on signup, no client changes
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          try { await seedDefaultData(user.id); } catch (e) { console.error("Seed failed:", e); }
        },
      },
    },
  },
});
