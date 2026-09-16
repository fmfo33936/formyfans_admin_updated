import api from "../../api";
import { endpoints } from "./endPoints";


export const changePassword = (payload) => {
    return api(endpoints.changePassword, payload, "put");
};