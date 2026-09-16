import { endpoints } from "./endPoints";
import api from "../../api";


export const verifyOtp = (payload) => {
    return api(endpoints.verifyOtp, payload, "post");
};