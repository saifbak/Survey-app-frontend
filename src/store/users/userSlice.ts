import {createSlice} from '@reduxjs/toolkit';

interface IUser {
    initials: string,
    dateOfBirth: string,
    _id: string,
    questions: [],
}

interface IQuestion {
    _id: string,
    question: string,
    options: string[],
    answer: string
}

export interface UserSliceState {

    user: IUser;
    loginLoading: boolean
    questions: IQuestion[]
}

const initialState: UserSliceState = {
    user: {
        initials: "",
        dateOfBirth: "",
        _id: "",
        questions: [],
    },
    loginLoading: false,
    questions: []
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setLogin: (state, action) => {
            return {...state, user: action.payload};
        },
        setLoginLoading: (state, action) => {
            return {...state, loginLoading: action.payload};
        },
        setQuestions: (state, action) => {
            return {...state, questions: action.payload};
        },
    },
});

export const {
    setLogin,
    setLoginLoading,
    setQuestions,
} = userSlice.actions;

export const selectUserSlice = (state: { user: UserSliceState }) => state.user;
export const selectUserLoading = (state: { loginLoading: boolean }) => state.loginLoading;

export default userSlice.reducer;
