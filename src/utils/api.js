import { BASEURL } from "./constants";

async function apiRequest(endpoints, options={})
{
    const url = `${BASEURL}/${endpoints}`
    
    try
    {
        const res = await fetch(url, 
        {
            method: options.method || 'GET',
            headers: 
            {
                'Content-Type': 'application/json',
                ...(options.headers || {}) // future-proofing for token support
            },
            body: options.body ? JSON.stringify(options.body) : null
        });

        const contentType = res.headers.get("content-type");

        if(!res.ok)
        {
            let errorText = `Request failed with status ${res.status}`;
            if (contentType && contentType.includes("application/json"))
            {
                const errorData = await res.json();
                errorText += ` - ${errorData.message || JSON.stringify(errorData)}`;
            }
            else
            {
                const errorTextRaw = await res.text();
                errorText += `- ${errorTextRaw}`;
            }

            throw new Error(errorText);
        }
        
        return await res.json();
    }
    catch(err)
    {
        console.error("API Error:", err.message || err);
        throw err; // rethrow so calling component (Game.jsx) can handle it
    }    
}

// Specific API: Get a character
export default async function getCharacter(id)
{
    return await apiRequest(id);
}