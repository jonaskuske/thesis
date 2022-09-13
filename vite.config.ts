import vue from '@vitejs/plugin-vue'
import ssr from 'vite-plugin-ssr/plugin'
import type { UserConfig } from 'vite'

const config: UserConfig = {
  define: { __VUE_OPTIONS_API__: false },
  build: { target: 'es2022' },
  plugins: [vue(), ssr()],
}

export default config
