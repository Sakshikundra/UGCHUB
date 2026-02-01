/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
      {
        protocol: 'https',
        hostname: '**.r2.cloudflarestorage.com',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com', // Google OAuth avatars
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb', // For file uploads
    },
  },
};

export default nextConfig;
