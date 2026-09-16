import api from "../../api";
import { endpoints } from "./endPoints";

/** GET /api/admin/profile */
export const getProfile = () => {
    return api(endpoints.getProfile, {}, "get");
};

/** PUT /api/admin/profile — body: `{ username, image? }` */
export const updateProfile = (payload) => {
    return api(endpoints.updateProfile, payload, "put");
};
