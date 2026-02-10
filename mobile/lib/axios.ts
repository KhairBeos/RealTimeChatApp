import axios from 'axios';
import { useAuth } from '@clerk/clerk-expo';
import { useEffect } from 'react';
import * as Sentry from '@sentry/react-native';

const API_BASE_URL = "https://realtimechatapp-j9ri0.sevalla.app/";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const useAxios = () => {
  const { getToken } = useAuth();
  useEffect(() => {
    const requestInterceptor = api.interceptors.request.use(async (config) => {
    const token = await getToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
    });

    const responseInterceptor = api.interceptors.response.use(
        (response) => response, 
        (error) => {
        if(error.response) {
            Sentry.logger.error(
                Sentry.logger.fmt`API request failed: ${error.config.method?.toUpperCase()} ${error.config.url} - Status: ${error.response.status}`,
                {
                    status: error.response.status,
                    method: error.config?.method,
                    url: error.config?.url,
                }
            )
        } else if (error.request) {
            Sentry.logger.warn("No response received for API request", {
                method: error.config?.method,
                url: error.config?.url,
            });
        }

        return Promise.reject(error);
    });

    return () => {
      api.interceptors.request.eject(requestInterceptor);
      api.interceptors.response.eject(responseInterceptor);
    };
  }, [getToken]);

    return api;
}