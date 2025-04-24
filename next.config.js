const nextTranslate = require('next-translate-plugin')

module.exports = nextTranslate({
  future: {
    webpack5: true,
  },
  publicRuntimeConfig: {
    NEXT_PUBLIC_BASE_DEV_URL: process.env.NEXT_PUBLIC_BASE_DEV_URL,
  },
  reactStrictMode: true,
  transpilePackages: ['react-datepicker'],
  webpack: (config) => {
    config.module.rules.unshift({
      test: /pdf\.worker\.(min\.)?js/,
      use: [
        {
          loader: "file-loader",
          options: {
            name: "[contenthash].[ext]",
            publicPath: "/_next/static/worker",
            outputPath: "static/worker",
          },
        },
      ],
    });

    return config;
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains'
          },
          // {
          //   key: 'Cache-Control',
          //   value: 'public, max-age=31536000, immutable'
          // },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()'
          }
        ],
      },
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, no-cache, must-revalidate'
          }
        ]
      },
      {
        source: '/(_next|api)/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self'; connect-src 'self'"
          }
        ]
      }
    ]
  },
})