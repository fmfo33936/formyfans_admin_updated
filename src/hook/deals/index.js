import { useCallback, useState } from "react";
import { toast } from "react-toastify";
import {
    getAllDealsAdmin,
    getDealByIdAdmin as getDealByIdAdminApi,
    verifyIncompleteDeal as verifyIncompleteDealApi,
} from "../../api/modules/deal";
import { parseDealDetail } from "../../utils/dealHelpers";
import { useCrud } from "../common/useCrud";

const defaultPagination = {
    page: 1,
    limit: 10,
    totalDeals: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false,
};

const parseDealsList = (data) => {
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.deals)) return data.deals;
    if (Array.isArray(data?.data?.deals)) return data.data.deals;
    if (Array.isArray(data?.data)) return data.data;
    return [];
};

const parsePagination = (data, listLength, page, limit) => {
    const meta = data?.pagination ?? data?.data?.pagination;
    if (meta && typeof meta === "object") {
        const totalDeals =
            meta.totalDeals ?? meta.total ?? meta.totalCount ?? listLength;
        return {
            ...defaultPagination,
            page: Number(meta.page) || page,
            limit: Number(meta.limit) || limit,
            totalDeals: Number(totalDeals) || 0,
            totalPages:
                Number(meta.totalPages) ||
                Math.ceil((Number(totalDeals) || 0) / (Number(meta.limit) || limit)) ||
                0,
            hasNextPage: Boolean(
                meta.hasNextPage ?? page * limit < (Number(totalDeals) || 0),
            ),
            hasPrevPage: Boolean(meta.hasPrevPage ?? page > 1),
        };
    }

    const hasMore = listLength >= limit;
    const loaded = (page - 1) * limit + listLength;
    const totalDeals = hasMore ? loaded + 1 : loaded;

    return {
        ...defaultPagination,
        page,
        limit,
        totalDeals,
        totalPages: Math.ceil(totalDeals / limit) || 0,
        hasNextPage: hasMore,
        hasPrevPage: page > 1,
    };
};

const useDeals = () => {
    const [deals, setDeals] = useState([]);
    const [pagination, setPagination] = useState(defaultPagination);
    const [dealDetail, setDealDetail] = useState(null);
    const [detailLoading, setDetailLoading] = useState(false);
    const [verifyLoading, setVerifyLoading] = useState(false);
    const { fetchAll, loading, error } = useCrud({
        fetchFn: getAllDealsAdmin,
    });

    const fetchAllDeals = useCallback(
        async ({ page = 1, limit = 10, status = "" } = {}) => {
            // Backend filter: /api/deal/admin/all?page=1&limit=10&status=pending
            const response = await fetchAll({
                page,
                limit,
                status: status || undefined,
            });

            if (!response?.success) {
                setDeals([]);
                return response;
            }

            const raw = response.data ?? {};
            const list = parseDealsList(raw);
            setDeals(list);
            setPagination(parsePagination(raw, list.length, page, limit));
            return response;
        },
        [fetchAll],
    );

    const fetchDealById = useCallback(async (dealId) => {
        if (!dealId) {
            toast.error("Deal id is missing");
            return null;
        }

        setDetailLoading(true);
        try {
            // GET /api/deal/admin/:dealId
            const res = await getDealByIdAdminApi(dealId);
            const ok = res?.status >= 200 && res?.status < 300;
            if (!ok) {
                toast.error(res?.data?.message || "Failed to load deal details");
                setDealDetail(null);
                return null;
            }

            const detail = parseDealDetail(res?.data);
            if (!detail) {
                toast.error("Deal details not found");
                setDealDetail(null);
                return null;
            }

            setDealDetail(detail);
            return detail;
        } catch (err) {
            toast.error(
                err?.response?.data?.message || err?.message || "Something went wrong",
            );
            setDealDetail(null);
            return null;
        } finally {
            setDetailLoading(false);
        }
    }, []);

    const verifyIncompleteDeal = useCallback(
        async (dealId, note) => {
            if (!dealId) {
                toast.error("Deal id is missing");
                return { success: false };
            }

            setVerifyLoading(true);
            try {
                const res = await verifyIncompleteDealApi(dealId, { note });
                const ok = res?.status >= 200 && res?.status < 300;
                if (ok) {
                    toast.success(res?.data?.message || "Deal marked as complete");
                    await fetchDealById(dealId);
                    return { success: true, data: res?.data };
                }

                const message = res?.data?.message || "Failed to mark deal complete";
                toast.error(message);
                return { success: false, message };
            } catch (err) {
                const message =
                    err?.response?.data?.message ||
                    err?.message ||
                    "Something went wrong";
                toast.error(message);
                return { success: false, message };
            } finally {
                setVerifyLoading(false);
            }
        },
        [fetchDealById],
    );

    return {
        deals,
        pagination,
        loading,
        dealDetail,
        detailLoading,
        verifyLoading,
        error,
        fetchAllDeals,
        fetchDealById,
        verifyIncompleteDeal,
    };
};

export default useDeals;
