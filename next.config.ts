import type { NextConfig } from "next";

// PDF/OCR dependencies are loaded at runtime via a createRequire resolver in
// /api/analyze, so a missing optional package degrades gracefully instead of
// breaking the build.
const nextConfig: NextConfig = {};

export default nextConfig;
