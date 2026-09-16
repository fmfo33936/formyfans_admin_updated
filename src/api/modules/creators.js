import { endpoints } from "./endPoints";
import api from "../../api";

/** Same route as users list: `GET admin/users?userType=creator&page&limit` */
export const getCreators = (params = {}) => {
    return api(endpoints.getUsers, { userType: "creator", ...params }, "get");
};

export const createCreator = (data) => {
    return api(endpoints.createCreator, data, "post");
};

export const updateCreator = (creatorId, data) => {
    const path = endpoints.updateUser.replace(":id", String(creatorId));
    return api(path, data, "put");
};

/** PATCH `admin/users/:userId/toggle-activity` — creator `_id` is the user id in the URL. */
export const updateCreatorStatus = (creatorId, status) => {
    const path = endpoints.updateUserStatus.replace(":userId", String(creatorId));
    return api(path, { status }, "patch");
};

export const updateCreatorFreeAccess = (userId, freeMonths) => {
    const path = endpoints.updateUserFreeAccess.replace(":userId", String(userId));
    return api(path, { freeMonths }, "patch");
};