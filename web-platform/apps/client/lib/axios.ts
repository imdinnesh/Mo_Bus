import axios from 'axios';

export const axiosInstance = axios.create({
    baseURL: 'http://localhost:8080/api/v1',
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials:true
});

export const locationAxiosInstance = axios.create({
    baseURL: 'http://localhost:4000',
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true
});
