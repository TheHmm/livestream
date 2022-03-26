import { fileURLToPath, URL } from 'url'
import { defineConfig }       from 'vite'
import vue                    from '@vitejs/plugin-vue'
import { visualizer }         from "rollup-plugin-visualizer"


// reference: https://vitejs.dev/config/

export default defineConfig({
  plugins: [
    vue(),
    visualizer( opts => ( { open: true } ) ) 
  ],
  build: {
    manifest              : true,
    sourcemap             : true,
    polyfillModulePreload : false,
    chunkSizeWarningLimit : 100,
  },
  resolve: {
    alias: {
      '@'               : fileURLToPath(new URL('./src', import.meta.url)),
      'vue-router'      : "vue-router/dist/vue-router.esm-bundler.js",
      'vue'             : "vue/dist/vue.esm-bundler.js",
      'hls.js'          : 'hls.js/dist/hls.light.min.js',
      'moment'          : 'moment/src/moment',
      'moment-timezone' : 'moment-timezone/builds/moment-timezone-with-data-2012-2022.min.js'
    }
  }
})
