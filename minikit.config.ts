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
    header: "",
    payload: "",
    signature: "",
  },
  baseBuilder: {
    allowedAddresses: [],
  },
  miniapp: {
    version: "1",
    name: "PATH Habit Streaks",
    subtitle: "Build lasting habits through daily consistency",
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
    ogTitle: "PATH Habit Streaks - Build lasting habits",
    ogDescription: "Track your daily habits and maintain streaks to build lasting change. Connect with your wallet or Farcaster to get started.",
    ogImageUrl: `${ROOT_URL}/hero.png`,
  },
} as const;
