import axios from "axios";
import {useDispatch} from "react-redux";
import {setLogin} from "./userSlice.ts";

export const useUserActions = () => {
    const dispatch = useDispatch();

    const userLogin = async (data: any) => {
        try {
            const payload = data;
            const response = await axios.post("https://survey-app-production-84d8.up.railway.app/api/v1/users/user", payload);
            dispatch(setLogin(response.data))
        } catch (err: any) {
            console.log("Failed to submit your answer. Please try again.");
        }
    }


    return {
        userLogin,
    };
}