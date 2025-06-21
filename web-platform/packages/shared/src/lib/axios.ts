import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const LOCATION_BASE_URL = process.env.NEXT_PUBLIC_LOCATION_BASE_URL;

if (!API_BASE_URL || !LOCATION_BASE_URL) {
  throw new Error('Missing required env variables in axios.ts');
}

export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

export const locationAxiosInstance = axios.create({
  baseURL: LOCATION_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});
