import { useCallback, useState } from "react";
import { getAllCampaignsAdmin } from "../../api/modules/campaign";
import { useCrud } from "../common/useCrud";

const defaultPagination = {
    page: 1,
    limit: 10,
    totalCampaigns: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false,
};

const parseCampaignsList = (data) => {
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.campaigns)) return data.campaigns;
    if (Array.isArray(data?.data?.campaigns)) return data.data.campaigns;
    if (Array.isArray(data?.data)) return data.data;
    return [];
};

const parsePagination = (data, listLength, page, limit) => {
    const meta = data?.pagination ?? data?.data?.pagination;
    if (meta && typeof meta === "object") {
        const totalCampaigns =
            meta.totalCampaigns ??
            meta.total ??
            meta.totalCount ??
            listLength;
        return {
            ...defaultPagination,
            page: Number(meta.page) || page,
            limit: Number(meta.limit) || limit,
            totalCampaigns: Number(totalCampaigns) || 0,
            totalPages:
                Number(meta.totalPages) ||
                Math.ceil((Number(totalCampaigns) || 0) / (Number(meta.limit) || limit)) ||
                0,
            hasNextPage: Boolean(
                meta.hasNextPage ?? page * limit < (Number(totalCampaigns) || 0),
            ),
            hasPrevPage: Boolean(meta.hasPrevPage ?? page > 1),
        };
    }

    const hasMore = listLength >= limit;
    const loaded = (page - 1) * limit + listLength;
    const totalCampaigns = hasMore ? loaded + 1 : loaded;

    return {
        ...defaultPagination,
        page,
        limit,
        totalCampaigns,
        totalPages: Math.ceil(totalCampaigns / limit) || 0,
        hasNextPage: hasMore,
        hasPrevPage: page > 1,
    };
};

const useCampaigns = () => {
    const [campaigns, setCampaigns] = useState([]);
    const [pagination, setPagination] = useState(defaultPagination);
    const { fetchAll, loading, error } = useCrud({
        fetchFn: getAllCampaignsAdmin,
    });

    const fetchAllCampaigns = useCallback(
        async ({ page = 1, limit = 10, search = "" } = {}) => {
            const response = await fetchAll({
                page,
                limit,
                search: search?.trim() || undefined,
            });
            if (!response?.success) {
                setCampaigns([]);
                return response;
            }

            const raw = response.data ?? {};
            let list = parseCampaignsList(raw);

            // Fallback: if API returns unfiltered list, match name or brand locally
            const q = String(search || "").trim().toLowerCase();
            if (q) {
                list = list.filter((item) => {
                    const name = String(item?.name ?? "").toLowerCase();
                    const brand = String(item?.brand ?? "").toLowerCase();
                    return name.includes(q) || brand.includes(q);
                });
            }

            setCampaigns(list);
            setPagination(parsePagination(raw, list.length, page, limit));
            return response;
        },
        [fetchAll],
    );

    return {
        campaigns,
        pagination,
        loading,
        error,
        fetchAllCampaigns,
    };
};

export default useCampaigns;
