// utils/api.js - A utility file for making authenticated requests

import Cookies from 'js-cookie'; // You'll need to install this: npm install js-cookie

// Base API caller function
//@ts-ignore
export async function apiCall(url, method = 'GET', data = null) {
    const headers = {
        'Content-Type': 'application/json',
    };

    const options = {
        method,
        headers,
        credentials: 'include', // Important: This ensures cookies are sent with requests
    };
    if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
        //@ts-ignore
        options.body = JSON.stringify(data);
    }

    try {
        //@ts-ignore
        const response = await fetch(url, options);
        if (!response.ok) {
            // Handle errors based on status code
            if (response.status === 401) {
                // Redirect to login page or handle unauthorized access
                console.log('Unauthorized access, redirecting to login...');
                // You might want to redirect here: router.push('/login');
            }
            throw new Error(`API error: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('API call failed:', error);
        throw error;
    }
}

// Example convenience methods
export const get = (url:any) => apiCall(url);
export const post = (url:any, data:any) => apiCall(url, 'POST', data);
export const put = (url:any, data:any) => apiCall(url, 'PUT', data);
export const del = (url:any) => apiCall(url, 'DELETE');