import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the workspace root to this directory. Without this, Next.js walks
  // up looking for a lockfile to infer the monorepo root and can land on
  // an unrelated one (e.g. a stray lockfile outside this repo, or the repo
  // root's server/ package), which throws off module resolution during build.
  outputFileTracingRoot: import.meta.dirname,
};

export default nextConfig;
