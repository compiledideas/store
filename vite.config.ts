import { defineConfig } from 'vite'
import { devtools } from '@tanstack/devtools-vite'

import { tanstackStart } from '@tanstack/react-start/plugin/vite'

import viteReact, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import tailwindcss from '@tailwindcss/vite'
import { nitro } from 'nitro/vite'

const config = defineConfig({
  resolve: { tsconfigPaths: true },
  plugins: [
    devtools(),
    nitro({ rollupConfig: { external: [/^@sentry\//] } }),
    tailwindcss(),
    tanstackStart(),
    viteReact(),
    babel({ presets: [reactCompilerPreset()] }),
  ],
  ssr: {
    // The SDK ships ESM with extensionless internal imports, which Node's
    // native ESM resolver rejects at SSR runtime. Bundling it through Vite
    // lets Vite's resolver normalize those specifiers.
    noExternal: ['@rackvise/storefront-sdk'],
  },
  optimizeDeps: {
    include: ['@rackvise/storefront-sdk'],
  },
})

export default config
