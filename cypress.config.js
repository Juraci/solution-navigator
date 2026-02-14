import { defineConfig } from 'cypress';

export default defineConfig({
  projectId: 'sjk5y2',
  e2e: {
    specPattern: 'cypress/e2e/**/*.{cy,spec}.{js,jsx,ts,tsx}',
    baseUrl: 'http://localhost:5173',
    defaultCommandTimeout: 10000,
    allowCypressEnv: false,
  },
});
