import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { defineConfig, loadEnv, transformWithEsbuild } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { normalizeBasePath, createSrcAliases } from './vite.helpers.mjs'

const projectRoot = fileURLToPath(new URL('.', import.meta.url))
const srcDirectory = path.resolve(projectRoot, 'src')



export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const devServerPort = Number(env.VITE_PORT || 3000)
  const previewPort = Number(env.VITE_PREVIEW_PORT || 4173)
  const proxyTarget = env.VITE_PROXY_TARGET || env.VITE_API_URL || 'http://localhost:3100'

  return {
    base: normalizeBasePath(env.VITE_BASE_PATH),
    plugins: [
      // esbuild.include is restricted to /src\/.*\.js$/ so Vite's built-in esbuild
      // transform skips .ts and .tsx files entirely.  @vitejs/plugin-react v4 relies on
      // that built-in pass for TypeScript stripping before its own Babel JSX transform,
      // so .tsx files reach vite:import-analysis as raw JSX/TS and fail to parse.
      //
      // This pre-plugin fills that gap by running esbuild on .ts/.tsx files directly:
      //   .ts  → TypeScript stripped, no JSX to handle
      //   .tsx → TypeScript + JSX transformed (esbuild takes the full job for these)
      //
      // Fast Refresh for .tsx components still works via @vitejs/plugin-react's module-
      // level HMR injection (it sees plain JS after this transform and passes through).
      {
        name: 'vite:ts-data-transform',
        enforce: 'pre',
        async transform(code, id) {
          if (id.includes('/node_modules/')) return null
          if (id.endsWith('.d.ts')) return null
          if (id.endsWith('.tsx')) {
            // Use automatic runtime to match @vitejs/plugin-react (avoids duplicate React instances)
            return transformWithEsbuild(code, id, { loader: 'tsx', jsx: 'automatic' })
          }
          if (id.endsWith('.ts')) {
            return transformWithEsbuild(code, id, { loader: 'ts' })
          }
          return null
        },
      },
      react(),
      tailwindcss(),
    ],
    resolve: {
      alias: [
        { find: 'path', replacement: 'path-browserify' },
        { find: '@', replacement: srcDirectory },
        ...createSrcAliases(srcDirectory)
      ]
    },
    esbuild: {
      include: /src\/.*\.js$/,
      exclude: [],
      loader: 'jsx'
    },
    define: {
      global: 'globalThis'
    },
    optimizeDeps: {
      esbuildOptions: {
        loader: {
          '.js': 'jsx'
        }
      }
    },
    server: {
      host: '0.0.0.0',
      port: devServerPort,
      strictPort: true,
      proxy: {
        '/api': {
          target: proxyTarget,
          changeOrigin: true,
          secure: false
        },
        '/socket.io': {
          target: proxyTarget,
          changeOrigin: true,
          secure: false,
          ws: true
        }
      }
    },
    preview: {
      host: '0.0.0.0',
      port: previewPort,
      strictPort: true
    },
    build: {
      outDir: 'dist'
    }
  }
})
