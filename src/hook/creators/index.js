import { useCallback, useState } from "react";
import { toast } from "react-toastify";
import {
    createCreator,
    getCreators,
    updateCreator,
    updateCreatorFreeAccess as updateCreatorFreeAccessApi,
    updateCreatorStatus as updateCreatorStatusApi,
} from "../../api/modules/creators";
import { useCrud } from "../common/useCrud";

const defaultPagination = {
    page: 1,
    limit: 10,
    totalUsers: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false,
};

export const useCreators = () => {
    const [creators, setCreators] = useState([]);
    const [pagination, setPagination] = useState(defaultPagination);
    const [statusUpdatingId, setStatusUpdatingId] = useState(null);
    const [freeAccessUpdatingId, setFreeAccessUpdatingId] = useState(null);

    const { fetchAll, create, update, loading, error } = useCrud({
        fetchFn: getCreators,
        createFn: createCreator,
        updateFn: updateCreator,
    });

    const fetchCreators = useCallback(
        async ({ page = 1, limit = 10 } = {}) => {
            const response = await fetchAll({ page, limit });
            if (response?.success) {
                const data = response.data ?? {};
                const list =
                    (Array.isArray(data.creators) && data.creators) ||
                    (Array.isArray(data.users) && data.users) ||
                    [];
                setCreators(list);
                setPagination({
                    ...defaultPagination,
                    ...data.pagination,
                });
            }
            return response;
        },
        [fetchAll],
    );

    const patchLocalCreator = useCallback((creatorId, partial) => {
        setCreators((prev) =>
            prev.map((c) => (c._id === creatorId ? { ...c, ...partial } : c)),
        );
    }, []);

    const updateCreatorStatus = useCallback(
        async (creatorId, status) => {
            setStatusUpdatingId(creatorId);
            try {
                const res = await updateCreatorStatusApi(creatorId, status);
                const ok = res?.status >= 200 && res?.status < 300;
                if (ok) {
                    patchLocalCreator(creatorId, { status });
                    const msg = res?.data?.message;
                    if (msg) toast.success(msg);
                    return { success: true, data: res?.data };
                }
                const message = res?.data?.message || "Request failed";
                toast.error(message);
                return { success: false, message };
            } catch (err) {
                const message =
                    err?.response?.data?.message || err?.message || "Something went wrong";
                toast.error(message);
                return { success: false, message };
            } finally {
                setStatusUpdatingId(null);
            }
        },
        [patchLocalCreator],
    );

    const updateCreatorFreeAccess = useCallback(
        async (userId, freeMonths) => {
            setFreeAccessUpdatingId(userId);
            try {
                const res = await updateCreatorFreeAccessApi(userId, freeMonths);
                const ok = res?.status >= 200 && res?.status < 300;
                if (ok) {
                    patchLocalCreator(userId, {
                        freeMonths,
                        freeMonthsExpireAt: null,
                        isAdminCreator: false,
                    });
                    const msg = res?.data?.message;
                    if (msg) toast.success(msg);
                    return { success: true, data: res?.data };
                }
                const message = res?.data?.message || "Request failed";
                toast.error(message);
                return { success: false, message };
            } catch (err) {
                const message = err?.response?.data?.message || err?.message || "Something went wrong";
                toast.error(message);
                return { success: false, message };
            } finally {
                setFreeAccessUpdatingId(null);
            }
        },
        [patchLocalCreator],
    );

    return {
        creators,
        pagination,
        loading,
        error,
        fetchCreators,
        createCreator: (payload) => create(payload),
        updateCreator: (creatorId, payload) => update(creatorId, payload),
        patchLocalCreator,
        updateCreatorStatus,
        updateCreatorFreeAccess,
        freeAccessUpdatingId,
        statusUpdatingId,
    };
};

export default useCreators;
