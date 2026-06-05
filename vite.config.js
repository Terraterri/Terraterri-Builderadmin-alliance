import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// https://vitejs.dev/config/
export default defineConfig({
  base: "https://builder.admin.terraterri.com/",
//   base: '/',
  plugins: [
    react({
      fastRefresh: false
    })
  ]
});
