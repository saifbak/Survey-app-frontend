import {createSlice} from '@reduxjs/toolkit';

export interface UserSliceState {

    user: null;
}

const initialState: UserSliceState = {
    user: null,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setLogin: (state, action) => {
            return {...state, user: action.payload};
        },
    },
});

export const {
    setLogin,
} = userSlice.actions;

export const selectUserSlice = (state: { user: UserSliceState }) => state.user;
export const selectUser = (state: { user: UserSliceState }) => state.user.user;

export default userSlice.reducer;
