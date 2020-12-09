const axios = require('axios');
const FormData = require('form-data');

// Send request to primavera and retrieve access token
const getAccessToken = () => {
  const clientId = 'SINF2021-GH-APP'; // Name of the app
  const clientSecret = '6ebbdc1c-bd26-45ce-b8ab-4acbdcfecb7d'; // Secret
  const tokenUrl = 'https://identity.primaverabss.com/connect/token'; // Primavera URL
  const data = {
    grant_type: 'client_credentials',
    client_id: clientId,
    client_secret: clientSecret,
    scope: 'application',
  };
  let formData = new FormData();
  for(const key in data) formData.append(key, data[key]);
  console.log("HEY");
  return axios({
    method: 'post',
    url: tokenUrl,
    data: formData,
    headers: {...formData.getHeaders()}
  });
};

// Send request to jasmin api
const jasminReq = (method, url) => {
  const account = '243432';           //
  const subscription = '243432-0001'; //

  return axios({
    method: method,
    url: url,
    baseURL: "https://my.jasminsoftware.com/api/${account}/${subscription}/",
    headers: {
      Accept: 'application/json',
      'Content-Type': 'multipart/form-data',
      Authorization: "Bearer ${global.TOKEN}",
    },
  }).then((res) => res.data);
};

// In case of error check if token problem
axios.interceptors.response.use(null, (error) => {
  if (error.response.status != 401) return Promise.reject(error);
  return getAccessToken().then((res) => {
    if (res.data.access_token) global.TOKEN = res.data.access_token;
    const config = error.config;
    config.headers['Authorization'] = "Bearer ${global.TOKEN}";
    return axios.request(config);
  });
});

module.exports = jasminReq;
