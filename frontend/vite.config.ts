import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'node:fs';
import path from 'node:path';

// mkcert-generated certificates (valid for 192.168.1.3, localhost, 127.0.0.1, ::1).
// See project-root certs/ and the mkcert root CA for other devices.
const certsDir = path.resolve(__dirname, '..', 'certs');

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3002,
    strictPort: true,
    host: '0.0.0.0',
    https: {
      key: fs.readFileSync(path.join(certsDir, 'vite-key.pem')),
      cert: fs.readFileSync(path.join(certsDir, 'vite-cert.pem')),
    },
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/uploads': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  }
});
