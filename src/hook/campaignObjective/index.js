import { useCallback, useState } from "react";
import { toast } from "react-toastify";
import {
    createCampaignObjective as createCampaignObjectiveApi,
    deleteCampaignObjective as deleteCampaignObjectiveApi,
    getCampaignObjectives as getCampaignObjectivesApi,
    updateCampaignObjective as updateCampaignObjectiveApi,
} from "../../api/modules/campaignObjectives";

const defaultPagination = {
    page: 1,
    limit: 50,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false,
};

const requestAction = async (fn, fallbackSuccess) => {
    try {
        const res = await fn();
        const ok = res?.status >= 200 && res?.status < 300;
        if (ok) {
            const msg = res?.data?.message;
            if (msg) toast.success(msg);
            else if (fallbackSuccess) toast.success(fallbackSuccess);
            return { success: true, data: res?.data?.data ?? res?.data };
        }
        const message = res?.data?.message || "Request failed";
        toast.error(message);
        return { success: false, message };
    } catch (err) {
        const message =
            err?.response?.data?.message ||
            err?.message ||
            "Something went wrong";
        toast.error(message);
        return { success: false, message };
    }
};

const extractList = (body) => {
    const payload = body?.data ?? body;
    if (Array.isArray(payload)) return payload;
    if (Array.isArray(payload?.campaignObjectives)) return payload.campaignObjectives;
    if (Array.isArray(payload?.objectives)) return payload.objectives;
    if (Array.isArray(body?.campaignObjectives)) return body.campaignObjectives;
    if (Array.isArray(body?.objectives)) return body.objectives;
    return [];
};

const extractPagination = (body, listLength, page, limit) => {
    const payload = body?.data ?? body;
    const meta = payload?.pagination ?? body?.pagination ?? {};
    return {
        ...defaultPagination,
        ...meta,
        page: meta.page ?? page,
        limit: meta.limit ?? limit,
        total:
            meta.totalCount ??
            meta.total ??
            meta.totalObjectives ??
            meta.totalItems ??
            body?.total ??
            listLength,
    };
};

export const useCampaignObjectives = () => {
    const [objectives, setObjectives] = useState([]);
    const [pagination, setPagination] = useState(defaultPagination);
    const [loading, setLoading] = useState(false);
    const [createLoading, setCreateLoading] = useState(false);
    const [updateLoading, setUpdateLoading] = useState(false);
    const [deleteLoadingId, setDeleteLoadingId] = useState(null);

    const fetchObjectives = useCallback(async ({ page = 1, limit = 50 } = {}) => {
        setLoading(true);
        try {
            const res = await getCampaignObjectivesApi({ page, limit });
            const ok = res?.status >= 200 && res?.status < 300;
            if (!ok) {
                toast.error(res?.data?.message || "Failed to fetch objectives");
                return { success: false };
            }
            const body = res?.data ?? {};
            const list = extractList(body);
            setObjectives(list);
            setPagination(extractPagination(body, list.length, page, limit));
            return { success: true, data: list };
        } catch (err) {
            toast.error(err?.message || "Failed to fetch objectives");
            return { success: false };
        } finally {
            setLoading(false);
        }
    }, []);

    const createObjective = useCallback(async (data) => {
        setCreateLoading(true);
        try {
            return await requestAction(
                () => createCampaignObjectiveApi(data),
                "Campaign objective created successfully",
            );
        } finally {
            setCreateLoading(false);
        }
    }, []);

    const updateObjective = useCallback(async (objectiveId, data) => {
        setUpdateLoading(true);
        try {
            return await requestAction(
                () => updateCampaignObjectiveApi(objectiveId, data),
                "Campaign objective updated successfully",
            );
        } finally {
            setUpdateLoading(false);
        }
    }, []);

    const deleteObjective = useCallback(async (objectiveId) => {
        setDeleteLoadingId(objectiveId);
        try {
            return await requestAction(
                () => deleteCampaignObjectiveApi(objectiveId),
                "Campaign objective deleted successfully",
            );
        } finally {
            setDeleteLoadingId(null);
        }
    }, []);

    return {
        objectives,
        pagination,
        loading,
        createLoading,
        updateLoading,
        deleteLoadingId,
        fetchObjectives,
        createObjective,
        updateObjective,
        deleteObjective,
    };
};

export default useCampaignObjectives;
