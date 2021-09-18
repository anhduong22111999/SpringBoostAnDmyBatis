const { createSlice } = require('@reduxjs/toolkit');

const categorySlice = createSlice({
  name: 'user',
  initialState: {
    listCategory: []
  },
  reducers: {
    addCategory: (state, action) => {
      state.listCategory = action.payload;
    }
  }
});

const { reducer: categoryReducer, actions } = categorySlice;
export const { addCategory } = actions;
export default categoryReducer;
