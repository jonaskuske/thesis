import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import ssr from 'vike/plugin'

export default defineConfig({
  define: { __VUE_OPTIONS_API__: false },
  build: { target: 'es2022', sourcemap: true, manifest: true },
  plugins: [
    vue({ template: { compilerOptions: { isCustomElement: (el) => el.includes('-') } } }),
    ssr(),
  ],
})
