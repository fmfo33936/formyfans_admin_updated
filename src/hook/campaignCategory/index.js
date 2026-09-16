import { useCallback, useState } from "react";
import { toast } from "react-toastify";
import {
    createCampaignCategory as createCampaignCategoryApi,
    deleteCampaignCategory as deleteCampaignCategoryApi,
    getCampaignCategories as getCampaignCategoriesApi,
    updateCampaignCategory as updateCampaignCategoryApi,
} from "../../api/modules/campaignCategories";

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
    if (Array.isArray(payload?.campaignCategories)) return payload.campaignCategories;
    if (Array.isArray(payload?.categories)) return payload.categories;
    if (Array.isArray(body?.campaignCategories)) return body.campaignCategories;
    if (Array.isArray(body?.categories)) return body.categories;
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
            meta.totalCategories ??
            meta.totalItems ??
            body?.total ??
            listLength,
    };
};

export const useCampaignCategories = () => {
    const [categories, setCategories] = useState([]);
    const [pagination, setPagination] = useState(defaultPagination);
    const [loading, setLoading] = useState(false);
    const [createLoading, setCreateLoading] = useState(false);
    const [updateLoading, setUpdateLoading] = useState(false);
    const [deleteLoadingId, setDeleteLoadingId] = useState(null);

    const fetchCategories = useCallback(async ({ page = 1, limit = 50 } = {}) => {
        setLoading(true);
        try {
            const res = await getCampaignCategoriesApi({ page, limit });
            const ok = res?.status >= 200 && res?.status < 300;
            if (!ok) {
                toast.error(res?.data?.message || "Failed to fetch categories");
                return { success: false };
            }
            const body = res?.data ?? {};
            const list = extractList(body);
            setCategories(list);
            setPagination(extractPagination(body, list.length, page, limit));
            return { success: true, data: list };
        } catch (err) {
            toast.error(err?.message || "Failed to fetch categories");
            return { success: false };
        } finally {
            setLoading(false);
        }
    }, []);

    const createCategory = useCallback(async (data) => {
        setCreateLoading(true);
        try {
            return await requestAction(
                () => createCampaignCategoryApi(data),
                "Campaign category created successfully",
            );
        } finally {
            setCreateLoading(false);
        }
    }, []);

    const updateCategory = useCallback(async (categoryId, data) => {
        setUpdateLoading(true);
        try {
            return await requestAction(
                () => updateCampaignCategoryApi(categoryId, data),
                "Campaign category updated successfully",
            );
        } finally {
            setUpdateLoading(false);
        }
    }, []);

    const deleteCategory = useCallback(async (categoryId) => {
        setDeleteLoadingId(categoryId);
        try {
            return await requestAction(
                () => deleteCampaignCategoryApi(categoryId),
                "Campaign category deleted successfully",
            );
        } finally {
            setDeleteLoadingId(null);
        }
    }, []);

    return {
        categories,
        pagination,
        loading,
        createLoading,
        updateLoading,
        deleteLoadingId,
        fetchCategories,
        createCategory,
        updateCategory,
        deleteCategory,
    };
};

export default useCampaignCategories;
