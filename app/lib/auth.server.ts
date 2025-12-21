import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "~/db/db.server";
import * as schema from "~/db/schema";
import { emailOTP } from "better-auth/plugins";

import { magicLink } from "better-auth/plugins";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: { ...schema },
  }),
  emailAndPassword: {
    enabled: true,
  },
});
