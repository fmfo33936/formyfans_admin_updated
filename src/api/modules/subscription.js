import { endpoints } from "./endPoints";
import api from "../../api";

export const getSubscriptionPlans = () => {
    return api(endpoints.subscriptionPlans, {}, "get");
};

/** PATCH body: `{ name, price, durationDays, features, isActive }` */
export const updateSubscriptionPlan = (planId, data) => {
    const path = endpoints.updateSubscriptionPlan.replace(":id", String(planId));
    return api(path, data, "put");
};
