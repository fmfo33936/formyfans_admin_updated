import { endpoints } from "./endPoints";
import api from "../../api";

/** GET /api/campaigns/admin/all?page=&limit=&search= */
export const getAllCampaignsAdmin = (params = {}) => {
    return api(
        endpoints.getAllCampaignsAdmin,
        {
            page: params.page,
            limit: params.limit,
            ...(params.search ? { search: params.search } : {}),
        },
        "get",
    );
};
