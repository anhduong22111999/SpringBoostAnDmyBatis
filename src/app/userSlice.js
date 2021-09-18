const { createSlice } = require('@reduxjs/toolkit');

const userSlice = createSlice({
  name: 'user',
  initialState: {
    current: {},
    listUsers: []
  },
  reducers: {
    addUser: (state, action) => {
      state.current = action.payload;
    },
    addListUser: (state, action) => {
      console.log('action: ', action.payload);
      state.listUsers = action.payload;
    }
  }
});

const { reducer: userReducer, actions } = userSlice;
export const { addUser, addListUser } = actions;
export default userReducer;
