import { endpoints } from "./endPoints";
import api from "../../api";

export const getUsers = (params = {}) => {
    return api(
        endpoints.getUsers,
        { userType: "user", ...params },
        "get",
    );
};

/** PATCH body: `{ status: "active" | "inactive" }` — `userId` is in the URL. */
export const updateUserStatus = (userId, status) => {
    const path = endpoints.updateUserStatus.replace(":userId", String(userId));
    return api(path, { status }, "patch");
};


export const updateSubscriptionPlan = (planId, data) => {
    const path = endpoints.updateSubscriptionPlan.replace(":id", String(planId));
    return api(path, data, "put");
};