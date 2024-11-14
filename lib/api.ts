// lib/api.ts
import axios, { AxiosInstance } from 'axios';
import { API_CONFIG } from './config';
import * as SecureStore from 'expo-secure-store';
import * as Device from 'expo-device';

const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  timeout: 10000
}) as AxiosInstance & {
  getDeviceId: () => Promise<string>;
};

// Add helper method to get device ID
api.getDeviceId = async (): Promise<string> => {
  try {
    const storedDeviceId = await SecureStore.getItemAsync('deviceId');
    if (storedDeviceId) {
      return storedDeviceId;
    }
    
    // Fallback untuk mendapatkan device ID
    const deviceId = Device.modelId ?? 
                    Device.deviceName ?? 
                    'unknown-device-' + Math.random().toString(36).substring(7);
                    
    await SecureStore.setItemAsync('deviceId', deviceId);
    return deviceId;
  } catch (error) {
    const fallbackId = 'unknown-device-' + Math.random().toString(36).substring(7);
    console.error('Failed to get device ID:', error);
    return fallbackId;
  }
};

// Request interceptor
api.interceptors.request.use(
  async (config) => {
    const token = await SecureStore.getItemAsync('userToken');
    const deviceId = await api.getDeviceId();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    config.headers['x-device-id'] = deviceId;

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;