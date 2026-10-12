/** @type {import('next').NextConfig} */
const nextConfig = {
  // PostHog reverse proxy (US region). Keeps analytics on this domain.
  async rewrites() {
    return [
      { source: "/ingest/static/:path*", destination: "https://us-assets.i.posthog.com/static/:path*" },
      { source: "/ingest/array/:path*", destination: "https://us-assets.i.posthog.com/array/:path*" },
      { source: "/ingest/:path*", destination: "https://us.i.posthog.com/:path*" },
    ];
  },
  // PostHog endpoints end in "/" (e.g. /e/); do not redirect them.
  skipTrailingSlashRedirect: true,
};
export default nextConfig;
