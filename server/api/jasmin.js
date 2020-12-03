import axios, { interceptors, request } from "axios";

const client_id     = "";                                                   // Name of the app
const client_secret = "";                                                   // Secret
const token_url     = "https://identity.primaverabss.com/connect/token";    // Primavera URL
const account       = "";                                                   //
const subscription  = "";                                                   // 

// Send http request
const httpReq = (method, url, data) => {
    return axios({
        method: method,
        baseUrl: url,
        data: data,
    });
};

// Send request to primavera and retrieve access token
const getAccessToken = () => {
    const data = {
        "grant_type": "client_credentials",
        "client_id": client_id,
        "client_secret": client_secret,
        "scope": "application",
    };

    return httpReq("post", token_url, data);
};

// Send request to jasmin api
const jasminReq = (method, url) => (
    axios({
        method: method,
        url: url,
        baseURL: "https://my.jasminsoftware.com/api/${account}/${subscription}/",
        headers: {
            "Accept": "application/json",
            "Content-Type": "multipart/form-data",
            "Authorization": process.env.TOKEN,
        },
    }).then((res) => (res.data))
);

// In case of error check if token problem
interceptors.response.use(null, (error) => {
    // If token not problem, return
    if(error.response.status != 401) return Promise.reject(error);
    // else get token and retry
    return getAccessToken().then((res) => {
        const config = error.config;
        if(res.data.access_token) process.env.TOKEN = res.data.access_token;
        return request(config);
    });
});

export default jasminReq