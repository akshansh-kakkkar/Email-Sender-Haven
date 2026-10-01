export function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Configuration error: ${name} is not configured.`);
  return value;
}

export function configurationStatus() {
  return {
    database: Boolean(process.env.DATABASE_URL),
    gmail: Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET && process.env.GOOGLE_REFRESH_TOKEN),
    admin: Boolean(process.env.ADMIN_SECRET),
    lumaWebhook: Boolean(process.env.LUMA_WEBHOOK_SECRET),
    cron: Boolean(process.env.CRON_SECRET),
  };
}
