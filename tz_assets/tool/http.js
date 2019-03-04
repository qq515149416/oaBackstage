import axios from  "axios";
const qs = require('qs');
const baseURL = location.protocol+"//"+location.hostname+"/tz_admin/";
export const get = (url,data={}) => {
    return new Promise((resolve,reject) => {
        axios.get(baseURL+url,{
            params: data
        }).then((response) => {
            resolve({
                data: response.data,
                status: response.status,
                statusText: response.statusText,
                headers: response.headers,
                config: response.config
            });
        }).catch((error) => {
            console.log(error.config);
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                reject({
                    errorCode: 1,
                    errorResult: {
                        data: error.response.data,
                        status: error.response.status,
                        headers: error.response.headers
                    }
                });
              } else if (error.request) {
                // The request was made but no response was received
                // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                // http.ClientRequest in node.js
                reject({
                    errorCode: 2,
                    errorResult: {
                        request: error.request
                    }
                });
              } else {
                // Something happened in setting up the request that triggered an Error
                reject({
                    errorCode: 3,
                    errorResult: {
                        msg: error.message
                    }
                });
              }

        });
    });
}
export const post = (url,data={}) => {
    return new Promise((resolve,reject) => {
        axios.post(baseURL+url,qs.stringify(data),{
            headers: {"Content-Type": "application/x-www-form-urlencoded"}
        }).then((response) => {
            resolve({
                data: response.data,
                status: response.status,
                statusText: response.statusText,
                headers: response.headers,
                config: response.config
            });
        }).catch((error) => {
            console.log(error.config);
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                reject({
                    errorCode: 1,
                    errorResult: {
                        data: error.response.data,
                        status: error.response.status,
                        headers: error.response.headers
                    }
                });
              } else if (error.request) {
                // The request was made but no response was received
                // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                // http.ClientRequest in node.js
                reject({
                    errorCode: 2,
                    errorResult: {
                        request: error.request
                    }
                });
              } else {
                // Something happened in setting up the request that triggered an Error
                reject({
                    errorCode: 3,
                    errorResult: {
                        msg: error.message
                    }
                });
              }
        });
    });
}
export const postFile = (url,data={}) => {
    return new Promise((resolve,reject) => {
        axios.post(baseURL+url,data,{
            headers: {"Content-Type": "multipart/form-data"}
        }).then((response) => {
            resolve({
                data: response.data,
                status: response.status,
                statusText: response.statusText,
                headers: response.headers,
                config: response.config
            });
        }).catch((error) => {
            console.log(error.config);
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                reject({
                    errorCode: 1,
                    errorResult: {
                        data: error.response.data,
                        status: error.response.status,
                        headers: error.response.headers
                    }
                });
              } else if (error.request) {
                // The request was made but no response was received
                // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                // http.ClientRequest in node.js
                reject({
                    errorCode: 2,
                    errorResult: {
                        request: error.request
                    }
                });
              } else {
                // Something happened in setting up the request that triggered an Error
                reject({
                    errorCode: 3,
                    errorResult: {
                        msg: error.message
                    }
                });
              }
        });
    });
}
