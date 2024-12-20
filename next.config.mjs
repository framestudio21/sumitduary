

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // experimental: {
  //   turbo: false, // Corrected: this should be a boolean directly within the `experimental` object
  // },
  images: {
    domains: ['googleusercontent.com', "drive.google.com", "http://localhost:3000/"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "googleusercontent.com", // Handle Google user content
        pathname: "**", // Match all paths for this domain
      },
      {
        protocol: "https",
        hostname: "drive.google.com",
        pathname: "/uc", // Match the `/uc` path
      },
      {
        protocol: "https",
        hostname: "drive.google.com",
        pathname: "/file/d/**", // Match the `/file/d/...` pattern
      },
    ],
  },
  // plugins: { cssnano: { preset: "default" } },
};

export default nextConfig;
