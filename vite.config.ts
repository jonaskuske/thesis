import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import ssr from 'vite-plugin-ssr/plugin'

const isHtmlOnly = process.env.DISABLE_JS === 'true'

export default defineConfig({
  define: { __VUE_OPTIONS_API__: false },
  build: { target: 'es2022', sourcemap: true },
  plugins: [vue({ reactivityTransform: true }), ssr({ includeAssetsImportedByServer: isHtmlOnly })],
})
