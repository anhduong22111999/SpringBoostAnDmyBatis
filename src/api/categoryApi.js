import axiosClient from './axiosClient';

const categoryApi = {
  getCategories: (params) => {
    const url = '/category/paging';
    return axiosClient.post(url, params);
  },
  getAllCategory: () => {
    const url = '/category/';
    return axiosClient.get(url);
  },
  deleteCategory: (params) => {
    const url = '/category/'.concat(params);
    return axiosClient.delete(url);
  },
  editCategory: (params) => {
    const url = '/category/'.concat(params._id);
    return axiosClient.put(url, params);
  },
  addCategory: (params) => {
    const url = '/category/';
    return axiosClient.post(url, params);
  }
};
export default categoryApi;
