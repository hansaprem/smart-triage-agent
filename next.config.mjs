/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  rewrites: async () => {
    const backendUrl = process.env.NLP_BACKEND_URL || "http://127.0.0.1:8000";
    return [
      {
        source: "/api/nlp/:path*",
        destination: `${backendUrl}/api/nlp/:path*`,
      },
    ];
  },
};

export default nextConfig;
