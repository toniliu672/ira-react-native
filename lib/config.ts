// lib/config.ts
export const API_CONFIG = {
    BASE_URL: 'https://ira-server-yipf.vercel.app/api/v1/mobile',
    ENDPOINTS: {
      LOGIN: '/auth/login',
      REGISTER: '/users',
      PROFILE: '/users/me',
      UPDATE_PROFILE: '/users/me',
      UPDATE_PASSWORD: '/users/me/password'
    }
  } as const;