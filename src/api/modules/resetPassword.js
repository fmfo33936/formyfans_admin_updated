import { endpoints } from "./endPoints";
import api from "../../api";



export const resetPassword = (payload) => {
    return api(endpoints.resetPassword, payload, "post");
};