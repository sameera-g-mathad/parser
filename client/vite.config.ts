import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite'; // required to run tailwind.

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],

  // important to mount changes while
  // using docker.
  server: {
    port: 3000,
    host: true,
    allowedHosts: ['client'], // required. Since nginx sends proxy requests to vite.
  },
});
