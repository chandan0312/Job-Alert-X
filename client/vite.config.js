import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'robots.txt', 'sitemap-core.xml'],
      manifest: {
        name: 'Job Alert X — Latest Govt Jobs, Sarkari Naukri & Results',
        short_name: 'Job Alert X',
        description: 'Job Alert X 2026 — India\'s #1 Govt Jobs Notification, Sarkari Naukri & Sarkari Result Portal. Latest government job vacancy 2026 across SSC, Railway, Banking, Police, UPSC.',
        theme_color: '#050814',
        background_color: '#eef4fc',
        display: 'standalone',
        orientation: 'portrait-primary',
        scope: '/',
        start_url: '/',
        lang: 'en-IN',
        icons: [
          {
            src: '/favicon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any maskable'
          }
        ],
        categories: ['news', 'education', 'productivity'],
        screenshots: [],
        shortcuts: [
          {
            name: 'Latest Jobs',
            short_name: 'Jobs',
            description: 'View latest government job notifications',
            url: '/latest/job',
            icons: [{ src: '/favicon.svg', sizes: '96x96' }]
          },
          {
            name: 'Admit Cards',
            short_name: 'Admit Cards',
            description: 'Download admit cards for upcoming exams',
            url: '/latest/admit-card',
            icons: [{ src: '/favicon.svg', sizes: '96x96' }]
          },
          {
            name: 'Results',
            short_name: 'Results',
            description: 'Check latest exam results and cutoffs',
            url: '/latest/result',
            icons: [{ src: '/favicon.svg', sizes: '96x96' }]
          },
          {
            name: 'Free Tools',
            short_name: 'Tools',
            description: 'Age calculator, eligibility checker, fee summary, document checklist',
            url: '/tools',
            icons: [{ src: '/favicon.svg', sizes: '96x96' }]
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'gstatic-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            urlPattern: /^https:\/\/pagead2\.googlesyndication\.com\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'adsense-cache',
              expiration: {
                maxEntries: 5,
                maxAgeSeconds: 60 * 60 * 24 // 1 day
              },
              networkTimeoutSeconds: 10,
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            urlPattern: /^https:\/\/api\..*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 // 1 day
              },
              networkTimeoutSeconds: 10,
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ],
        skipWaiting: true,
        clientsClaim: true,
      },
      devOptions: {
        enabled: true,
        type: 'module',
        navigateFallback: 'index.html',
      },
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 5173,
    open: true,
  },
  build: {
    // Optimize for Core Web Vitals
    cssCodeSplit: true,
    modulePreload: {
      polyfill: false, // Native modulepreload is widely supported
    },
    rollupOptions: {
      output: {
        // Better chunk splitting for caching
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-icons': ['lucide-react'],
        },
        // Consistent chunk names for caching
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
      },
    },
    // Minify with esbuild for speed
    minify: 'esbuild',
    // Target modern browsers for smaller bundles
    target: 'es2020',
  },
})

