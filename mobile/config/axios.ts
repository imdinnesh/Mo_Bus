import axios from 'axios';

export const axiosClient = axios.create({
    baseURL: "http://192.168.29.82:8080/api/v1",
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});




