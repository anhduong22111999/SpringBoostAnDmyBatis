const { createSlice } = require('@reduxjs/toolkit');

const bookSlice = createSlice({
  name: 'user',
  initialState: {},
  reducers: {}
});

const { reducer: bookReducer, actions } = bookSlice;
export const { addlistBook } = actions;
export default bookReducer;
