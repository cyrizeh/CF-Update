/* eslint-disable no-useless-catch */
import { isBrowser } from '@/utils';
import axios from 'axios';
import jwtDecode from 'jwt-decode';
import { ApiTypes } from '@/types';

export const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_DEV_URL,
});

export const getAccessToken = async () => {
  const deserializedToken = (await axios('/api/getSession')).data;
  const accessToken = deserializedToken?.accessToken;
  return accessToken;
};

const getRefreshToken = async () => {
  const deserializedToken = (await axios('/api/refreshToken')).data;
  const accessToken = deserializedToken?.accessToken;
  return accessToken;
};

function isTokenExpired(token: any) {
  const decodedToken = jwtDecode<ApiTypes.JwtToken>(token);
  const expirationTime = decodedToken.exp * 1000;
  const currentTime = Date.now();
  return expirationTime < currentTime;
}

let token: string | null = null;
let isRefreshing = false;
let refreshSubscribers: any[] = [];
let isRetrievingAccessToken = false;
let retrieveAccessTokenSubscribers: any[] = [];

async function refreshAccessToken() {
  try {
    const newAccessToken = await getRefreshToken();
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;

    refreshSubscribers.forEach((callback) => callback(newAccessToken));
    refreshSubscribers = [];

    return newAccessToken;
  } catch (error) {
    console.error('Error refreshing token:', error);
    window.location.replace('/api/auth/logout');
    throw error;
  }
}

async function retrieveAccessToken() {
  try {
    const accessToken = await getAccessToken();
     axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

    retrieveAccessTokenSubscribers.forEach((callback) => callback(accessToken));
    retrieveAccessTokenSubscribers = [];

    return accessToken;
  } catch (error) {
    throw error;
  }
}

axiosInstance.interceptors.request.use(
  async function (config) {
    if (!isBrowser()) {
      return config;
    }

    if (config.headers.Authorization && !isTokenExpired((config.headers.Authorization as string).split(' ')[1]) ) {
      return config;
    }

    if (!token) {
      if (!isRetrievingAccessToken) {
        isRetrievingAccessToken = true;
      try {
      const accessToken = await retrieveAccessToken();
      token = accessToken;
      config.headers.authorization = `Bearer ${token}`;
      return config;
    } finally {
      isRetrievingAccessToken = false;
    } }
    else {
      return new Promise((resolve) => {
        retrieveAccessTokenSubscribers.push((accessToken: string) => {
          config.headers.authorization = `Bearer ${accessToken}`;
          resolve(config);
        });

      });
    }
  }


    if (!isRefreshing) {
      isRefreshing = true;
      try {
        const newAccessToken = await refreshAccessToken();
        config.headers.Authorization = `Bearer ${newAccessToken}`;
        return config;
      } finally {
        isRefreshing = false;
      }
    } else {
      return new Promise((resolve) => {
        refreshSubscribers.push((newAccessToken: string) => {
          config.headers.Authorization = `Bearer ${newAccessToken}`;
          resolve(config);
        });
      });
    }
  },
  function (error) {
    return Promise.reject(error);
  }
);

// Add a response interceptor
axiosInstance.interceptors.response.use(
  function (response) {
    return response;
  },
  async function (error) {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isBrowser()) {
        localStorage?.clear();
      }
      originalRequest._retry = true;
      const accessToken = await getRefreshToken();
      axiosInstance.defaults.headers.common['Authorization'] = 'Bearer ' + accessToken;
      return axiosInstance(originalRequest);
    }

    return Promise.reject(error);
  }
);
