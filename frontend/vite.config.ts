import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,              // 🔹 Cổng mặc định của Vite
    open: true,              // 🔹 Tự mở trình duyệt khi chạy npm run dev
  },
  resolve: {
    alias: {
      "@": "/src",           // 🔹 Dễ import: import { X } from "@/components/X"
    },
  },
  css: {
    devSourcemap: true,      // 🔹 Giúp debug Tailwind dễ hơn
  },
  build: {
    outDir: "dist",
    sourcemap: false,        // Có thể bật true nếu cần debug production
  },
});
