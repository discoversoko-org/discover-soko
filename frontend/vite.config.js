import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "")

  const devPort = Number(env.VITE_DEV_PORT || 5174)
  const devHost = env.VITE_DEV_HOST || "localhost"

  return {
    plugins: [react()],
    server: {
      host: devHost,
      port: devPort,
      strictPort: true,
      hmr: {
        host: devHost,
        clientPort: devPort,
        port: devPort,
      },
    },
  }
})
