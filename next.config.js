const withPWA = require("@imbios/next-pwa")({
  dest: "public",
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
};

// module.exports = withPWA(nextConfig);
module.exports = nextConfig;
