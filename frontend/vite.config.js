import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    // Khi DEV: frontend chạy cổng 5173, backend Go chạy cổng 8080.
    // Proxy chuyển tiếp mọi request /api và /uploads về backend
    // → code chỉ cần gọi axios.get('/api/products'), không hardcode domain.
    // Khi lên PRODUCTION: Nginx cũng proxy y hệt → cùng 1 code chạy cả 2 nơi.
    proxy: {
      '/api': 'http://localhost:8080',
      '/uploads': 'http://localhost:8080'
    }
  }
})