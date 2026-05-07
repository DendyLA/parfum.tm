/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		unoptimized: process.env.NODE_ENV === 'development',
		remotePatterns: [
            {
                protocol: 'http',
                hostname: '127.0.0.1',
                port: '8000',
            },
            {
                protocol: 'https',
                hostname: 'parfum.com.tm',
            },
        ],
		
	},
};

export default nextConfig;
