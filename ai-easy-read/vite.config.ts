import { defineConfig } from "vite"
import react from "@vitejs/plugin-react-swc"
import { fileURLToPath } from "node:url"
import svgr from "vite-plugin-svgr"
import version from "vite-plugin-package-version"
import { visualizer } from "rollup-plugin-visualizer"
import dayjs from "dayjs"

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: '/', // 确保使用相对路径
  plugins: [react(), svgr(), version(), visualizer()],
  define: {
    "import.meta.env.BUILD_DATE": JSON.stringify(dayjs().format("YYYY-MM-DD")),
    'process.env.PUBLIC_URL': JSON.stringify(''),
  },
  resolve: {
    alias: [
      {
        find: "@",
        replacement: fileURLToPath(new URL("./src", import.meta.url)),
      },
    ],
  },
}))
