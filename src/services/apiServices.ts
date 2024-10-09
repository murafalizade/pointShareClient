import {baseUrl} from "../constants/baseUrl.ts";
import Cookies from "js-cookie";

export const fetchUserInformation = async () => {
    const response = await fetch(baseUrl+'/api/v1/users/profile', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${Cookies.get('token')}`, // Use your token method
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json();
};

export const login = async (user,activeTab) => {
    const response = await fetch(baseUrl+'/api/v1/users/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: user.email,
            username: activeTab === 'register' ? user.username : undefined, // Only send username for register
            password: user.password
        })
    });
    if (!response.ok) {
        throw new Error('Login failed');
    }
    return response.json();
}

export const fetchPointHistory = async () => {
    const response = await fetch(`${baseUrl}/api/v1/users/point-history`, {
        headers: {
            Authorization: `Bearer ${Cookies.get('token')}`,
        },
    });
    if (!response.ok) {
        throw new Error('Error fetching point history');
    }
    return response.json();
};

export const fetchTopRanked = async (country:string) => {
    const response = await fetch(`${baseUrl}/api/v1/users/top-ranked?country=${country}`, {
        headers: {
            Authorization: `Bearer ${Cookies.get('token')}`,
        },
    });
    if (!response.ok) {
        throw new Error('Error fetching point history');
    }
    return response.json();
};