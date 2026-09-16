import { endpoints } from "./endPoints";
import api from "../../api";

export const adminLogin = (payload) => {
    return api(endpoints.adminLogin, payload, "post");
}