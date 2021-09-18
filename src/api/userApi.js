import axiosClient from './axiosClient';

const userApi = {
  login: (params) => {
    const url = '/auth/login';
    return axiosClient.post(url, { username: params.username, password: params.password });
  },
  logOut: () => {
    const url = '/auth/logout';
    return axiosClient.post(url);
  },
  getListUser: (params) => {
    const url = '/users/paging';
    return axiosClient.post(url, params);
  },
  deleteUser: (params) => {
    const url = '/users/'.concat(params);
    return axiosClient.delete(url);
  },
  addUser: (params) => {
    const url = '/users/';
    return axiosClient.post(url, params);
  },
  editUser: (params) => {
    const url = '/users/'.concat(params._id);
    return axiosClient.put(url, params);
  },
  changePassword: (params) => {
    const url = '/auth/';
    return axiosClient.put(url, {
      username: params.username,
      password: params.password,
      newPassword: params.newPassword,
      lastName: params.lastName,
      firstName: params.firstName
    });
  }
};
export default userApi;
