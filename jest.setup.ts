import { loadEnvConfig } from '@next/env'

// Load environment variables before tests run
loadEnvConfig(process.cwd(), true)