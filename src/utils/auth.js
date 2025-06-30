import { baseURL } from "../utils/constants.js";

export const register = ({name, email, password}) => {
    return fetch(`${baseURL}/signup`, {
        method: "POST",
        headers: {"Content-Type": "application/json",},
        body: JSON.stringify({name, email, password}),
    }).then((async (res) => {
        if(!res.ok) {
            const errorData = await res.json();
            const error = new Error(errorData.message || "An error occurred during registration");
            error.status = res.status;
            throw error;
        }
        return res.json();
    }));
};

export const login = ({email, password}) => 
    authRequest({
        endpoints: "signin",
        method: "POST",
        body: {email, password},
    });

export const checkToken = (token) => 
    authRequest({
        endpoints: "users/me",
        method: "GET",
        token,
    });

const authRequest = ({endpoints, method = "GET", token = null, body = null}) => {
    const headers = {"Content-Type": "application/json",};
    if (token) headers.Authorization = `Bearer ${token}`;

    return fetch(`${baseURL}/${endpoints}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
    }).then(handleResponse);
}

const handleResponse = (res, errorMessage) => {
    return res.ok ? res.json() : Promise.reject(`${errorMessage}: ${res.status}`);
};