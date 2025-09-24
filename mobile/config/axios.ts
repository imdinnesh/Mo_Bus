import axios from 'axios';

export const axiosClient = axios.create({
    baseURL: "http://localhost:8080/api/v1",
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});




