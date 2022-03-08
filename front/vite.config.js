import { fileURLToPath, URL } from 'url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { visualizer } from "rollup-plugin-visualizer"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue({
      ssr: true
    }),
    visualizer( opts => ({
      open: true,
    })) 
  ],
  build: {
    polyfillModulePreload: false, 
    sourcemap: true,
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      // 'vue-router': "vue-router/dist/vue-router.esm-bundler.js",
      // vue: "vue/dist/vue.esm-bundler.js",
      moment: 'moment/src/moment',
      'hls.js': 'hls.js/dist/hls.light.min.js',
      'moment-timezone': 'moment-timezone/builds/moment-timezone-with-data-2012-2022.min.js'
    }
  }
})
