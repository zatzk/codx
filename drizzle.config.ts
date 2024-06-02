/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */

import { defineConfig } from "drizzle-kit"
import { env } from "~/env";

export default defineConfig({
    schema: "./src/server/db/schema.ts",
    dialect: "postgresql",
    dbCredentials: {
        url: env.POSTGRES_URL,
    },
    tablesFilter: ["codx_*"],
})