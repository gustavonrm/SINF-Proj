const axios = require("axios");

const client_id = "";       // Name of the app
const client_secret = "";   // Secret
const req_url = "https://identity.primaverabss.com/connect/token";  // Primavera URL

const httpReq = (method, url, data) => {
    return axios({
        method: method,
        baseUrl: url,
        data: data,
    });
};

const getAccessToken = () => {
    const data = {
        "grant_type": "client_credentials",
        "client_id": client_id,
        "client_secret": client_secret,
        "scope": "application",
    };

    return httpReq("post", req_url, data);
};

const jasminReq = (method, url) => {
    return axios({
        method: method,
        url: url,
        baseURL: "https://my.jasminsoftware.com/api/XXX/XXX/", // TODO: COMPLETE URL
        headers: {
            "Accept": "application/json",
            "Content-Type": "multipart/form-data",
        },
    });
};