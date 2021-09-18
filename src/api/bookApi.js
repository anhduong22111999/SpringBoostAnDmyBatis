import axiosClient from './axiosClient';

const bookApi = {
  getListBook: (params) => {
    const url = '/books/paging';
    return axiosClient.post(url, params);
  },
  homePaging: (params) => {
    const url = '/books/homepaging';
    return axiosClient.post(url, params);
  },
  deleteBook: (params) => {
    const url = '/books/'.concat(params);
    return axiosClient.delete(url);
  },
  editBook: (params, _id) => {
    const url = '/books/'.concat(_id);
    return axiosClient.put(url, params);
  },
  getBookById: (params) => {
    const url = '/books/'.concat(params);
    return axiosClient.get(url);
  },
  addBook: (params) => {
    const url = '/books/';
    return axiosClient.post(url, params);
  }
};
export default bookApi;
