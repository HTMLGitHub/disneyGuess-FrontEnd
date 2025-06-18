import { baseURL } from "./constants";

async function apiRequest(url, options={})
{
    const res = await fetch(url, options);
    return await (res.ok ? res.json(): Promise.reject(`Error: ${res.status}`));
}

export async function getCharacter({id})
{
    return await apiRequest(`${baseURL}/${id}`);
}