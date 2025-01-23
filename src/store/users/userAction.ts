import axios from "axios";
import {useDispatch} from "react-redux";
import {setLogin, setLoginLoading, setQuestions} from "./userSlice.ts";

export const useUserActions = () => {
    const dispatch = useDispatch();

    const userLogin = async (data: any) => {
        dispatch(setLoginLoading(true))
        try {
            const payload = data;
            const response = await axios.post("https://survey-app-production-84d8.up.railway.app/api/v1/users/user", payload);
            dispatch(setLogin(response.data))
            dispatch(setLoginLoading(false))
            return response.data;
        } catch (err: unknown) {
            dispatch(setLoginLoading(false))
            console.log("Failed to submit your answer. Please try again.");
        }
    }

    const getQuestions = async () => {
        try {
            const response = await axios.get("https://survey-app-production-84d8.up.railway.app/api/v1/questions");
            dispatch(setQuestions(response.data))
            return response.data;
        } catch (err: unknown) {
            console.log("Failed to submit your answer. Please try again.");
        }
    }


    return {
        userLogin,
        getQuestions,
    };
}
