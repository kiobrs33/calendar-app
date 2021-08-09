const baseURL = process.env.REACT_APP_API_URL;

export const fetchSinToken = (endpoint, data, method = 'GET') => {

    //BaseURL => http://localhost:4000 o https://calendar-bac-kend.herokuapp.com
    const url = `${baseURL}/${endpoint}`;

    if (method === 'GET') {
        return fetch(url)
    } else {
        return fetch(url,{
            method,
            headers:{
                'Content-type': 'application/json'
            },
            body: JSON.stringify( data )
        });
    }
}

export const fetchConToken = (endpoint, data, method = 'GET') => {

    //BaseURL => http://localhost:4000 o https://calendar-bac-kend.herokuapp.com
    const url = `${baseURL}/${endpoint}`;
    const token = localStorage.getItem('token') || ''; 

    if (method === 'GET') {
        return fetch(url, {
            method,
            headers: {
                'x-token': token
            }
        });
    } else {
        return fetch(url,{
            method,
            headers:{
                'Content-type': 'application/json',
                'x-token': token
            },
            body: JSON.stringify( data )
        });
    }
}