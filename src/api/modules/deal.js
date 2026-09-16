import { endpoints } from "./endPoints";
import api from "../../api";

/** GET /api/deal/admin/all?page=&limit=&status= */
export const getAllDealsAdmin = (params = {}) => {
    const query = {
        page: params.page,
        limit: params.limit,
        ...(params.status ? { status: params.status } : {}),
    };
    return api(endpoints.getAllDealsAdmin, query, "get");
};

/** GET /api/deal/admin/:dealId */
export const getDealByIdAdmin = (dealId) => {
    const path = endpoints.getDealByIdAdmin.replace(":dealId", String(dealId));
    return api(path, {}, "get");
};

/** PATCH /api/deal/admin/:dealId/verify-incomplete */
export const verifyIncompleteDeal = (dealId, payload = {}) => {
    const path = endpoints.verifyIncompleteDeal.replace(":dealId", String(dealId));
    return api(path, payload, "patch");
};
