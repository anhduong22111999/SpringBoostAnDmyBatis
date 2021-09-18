// api/axiosClient.js
import axios from 'axios';
import queryString from 'query-string';
// Set up default config for http requests here
// Please have a look at here `https://github.com/axios/axios#requestconfig` for the full list of configs
import store from '../app/store';

const axiosClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    'content-type': 'application/json'
  },
  paramsSerializer: (params) => queryString.stringify(params)
});
store.subscribe(() => {
  const { token } = store.getState().user.current;
  axiosClient.defaults.headers.common['auth-token'] = token;
  // console.log('1 : ', token);
});

axiosClient.interceptors.request.use((config) => {
  console.log('Redirect to', config.url);
  return config;
});
axiosClient.defaults.headers.common['auth-token'] = store.getState().user.current.token;

axiosClient.interceptors.response.use(
  (response) => {
    if (response && response.data) {
      return response.data;
    }
    return response;
  },
  (error) => {
    // Handle errors
    throw error;
  }
);
export default axiosClient;
