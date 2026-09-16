import { endpoints } from "./endPoints";
import api from "../../api";

export const forgotPassword = (payload) => {
    return api(endpoints.forgotPassword, payload, "post");
};
