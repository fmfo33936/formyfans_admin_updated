import { endpoints } from "./endPoints";
import api from "../../api";

export const getCampaignObjectives = (params = {}) => {
    return api(endpoints.getCampaignObjectives, params, "get");
};

export const createCampaignObjective = (data) => {
    return api(endpoints.createCampaignObjective, data, "post");
};

export const updateCampaignObjective = (objectiveId, data) => {
    const path = endpoints.updateCampaignObjective.replace(":id", String(objectiveId));
    return api(path, data, "put");
};

export const deleteCampaignObjective = (objectiveId) => {
    const path = endpoints.deleteCampaignObjective.replace(":id", String(objectiveId));
    return api(path, {}, "delete");
};
