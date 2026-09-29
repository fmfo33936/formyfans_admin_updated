import { endpoints } from "./endPoints";
import api from "../../api";

export const getCreditPricing = () => {
    return api(endpoints.creditPricing, {}, "get");
};

export const updateCreditPricing = (payload) => {
    return api(endpoints.creditPricing, payload, "put");
};
