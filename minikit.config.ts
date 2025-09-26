const ROOT_URL =
  process.env.NEXT_PUBLIC_URL ||
  (process.env.VERCEL_URL && `https://${process.env.VERCEL_URL}`) ||
  "http://localhost:3000";

/**
 * MiniApp configuration object. Must follow the mini app manifest specification.
 *
 * @see {@link https://docs.base.org/mini-apps/features/manifest}
 */
export const minikitConfig = {
  accountAssociation: {
    header: "eyJmaWQiOjEzNTQ3NjgsInR5cGUiOiJjdXN0b2R5Iiwia2V5IjoiMHg5ZWExMjc3NTI3NkM1MUJCMGQzOTQ5NGZhQmU2Rjc5ZDM5MEE2YTlFIn0",
    payload: "eyJkb21haW4iOiJwYXRoLWhhYml0LXN0cmVha3MtNXJiaS52ZXJjZWwuYXBwIn0",
    signature: "MHgyNjRmNTcyNGQ0NmYwZTcyZTMyNTMzNTUwYTk5ZGNmZWEzM2I2Y2U1NDJkYmI0Y2IxZTMzNTU1ZTA1OWNiNzNhNjBjYWM2MTFkZmUzM2VjZWQ3MTgzNWM1Zjg1OGUyNDUzODFmMmMxMmMzZjY0OTgwNjU0MGUxZWQ4M2VmZTg0ODFj",
  },
  baseBuilder: {
    allowedAddresses: [],
  },
  miniapp: {
    version: "1",
    name: "PATH Habit Streaks",
    subtitle: "Build lasting habits",
    description: "Track your daily habits and maintain streaks to build lasting change. Connect with your wallet or Farcaster to get started.",
    screenshotUrls: [`${ROOT_URL}/screenshot.png`],
    iconUrl: `${ROOT_URL}/icon.png`,
    splashImageUrl: `${ROOT_URL}/splash.png`,
    splashBackgroundColor: "#1e40af",
    homeUrl: ROOT_URL,
    webhookUrl: `${ROOT_URL}/api/webhook`,
    primaryCategory: "productivity",
    tags: ["habits", "productivity", "streaks", "self-improvement"],
    heroImageUrl: `${ROOT_URL}/hero.png`,
    tagline: "Build habits that stick",
    ogTitle: "PATH Habit Streaks",
    ogDescription: "Track daily habits and maintain streaks. Connect wallet or Farcaster to get started.",
    ogImageUrl: `${ROOT_URL}/hero.png`,
  },
} as const;
