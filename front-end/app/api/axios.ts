// app/api/axios.ts
import axios from 'axios';

const api = axios.create({
    // Set your Django API base URL. If you use a Vite proxy later, you can change this to '/api/'
    baseURL: 'http://127.0.0.1:8000/api/',
});

// Add a request interceptor to automatically attach the token from localStorage
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers.Authorization = `Token ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default api;
