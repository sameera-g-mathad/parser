import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite'; // required to run tailwind.
import tsconfigPaths from 'vite-tsconfig-paths'; // required to use '@/something_file_path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), tsconfigPaths()],

  // important to mount changes while
  // using docker.
  server: {
    port: 3000,
    host: true,
    allowedHosts: ['client'], // required. Since nginx sends proxy requests to vite.
  },
});
