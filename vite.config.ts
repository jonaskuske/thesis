import vue from '@vitejs/plugin-vue'
import ssr from 'vite-plugin-ssr/plugin'
import type { UserConfig } from 'vite'

const config: UserConfig = {
  define: { __VUE_OPTIONS_API__: false },
  build: { target: 'es2022', sourcemap: true },
  plugins: [vue({ reactivityTransform: true }), ssr()],
}

export default config
