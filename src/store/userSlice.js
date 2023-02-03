import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  name : 'Guess'
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    updateUsername: (state, action) => {
      //console.log(action.payload);
      state.name = action.payload
    },
  }
});

export const {updateUsername} = userSlice.actions;

export const selectUsername = state => state.user.username;

export default userSlice.reducer;