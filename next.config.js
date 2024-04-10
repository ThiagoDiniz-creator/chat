/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        serverComponentsExternalPackages: ["sqlite3", "sequelize"]
    },
    images: {
        domains: ['storage.googleapis.com']
    }
}

module.exports = nextConfig
