import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    status: false,
    postsData: null
}

const postSlice = createSlice({
    name: 'post',
    initialState,
    reducers: {
        allPosts: (state, action) => {
            state.status = true;
            state.postsData = action.payload;
        }
    }
})

export const {allPosts} = postSlice.actions;
export default postSlice.reducer;