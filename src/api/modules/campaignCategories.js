import { endpoints } from "./endPoints";
import api from "../../api";

export const getCampaignCategories = (params = {}) => {
    return api(endpoints.getCampaignCategories, params, "get");
};

export const createCampaignCategory = (data) => {
    return api(endpoints.createCampaignCategory, data, "post");
};

export const updateCampaignCategory = (categoryId, data) => {
    const path = endpoints.updateCampaignCategory.replace(":id", String(categoryId));
    return api(path, data, "put");
};

export const deleteCampaignCategory = (categoryId) => {
    const path = endpoints.deleteCampaignCategory.replace(":id", String(categoryId));
    return api(path, {}, "delete");
};
