const axios = require('axios');

// Send request to jasmin api
const saftReq = (url) => {  
    return axios({
      method: 'get',
      url: url,
      baseURL: 'http://127.0.0.1:5432',
      headers: {
        Accept: 'application/json',
      },
    }).then((res) => res.data);
  };

module.exports = saftReq;