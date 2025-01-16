import {createSlice} from '@reduxjs/toolkit';

interface IUser {
    initials: string,
    dateOfBirth: string,
    _id: string,
    questions: [],
}

export interface UserSliceState {

    user: IUser;
}

const initialState: UserSliceState = {
    user: {
        initials: "",
        dateOfBirth: "",
        _id: "",
        questions: [],
    },
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
