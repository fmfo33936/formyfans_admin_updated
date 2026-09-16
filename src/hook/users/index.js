import { useCallback, useState } from "react";
import { toast } from "react-toastify";
import { getUsers, updateUserStatus as updateUserStatusApi } from "../../api/modules/users";
import { useCrud } from "../common/useCrud";

const defaultPagination = {
    page: 1,
    limit: 10,
    totalUsers: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false,
};

export const useUsers = () => {
    const [users, setUsers] = useState([]);
    const [pagination, setPagination] = useState(defaultPagination);
    const [statusUpdatingId, setStatusUpdatingId] = useState(null);

    const { fetchAll, loading, error } = useCrud({
        fetchFn: getUsers,
    });

    const fetchUsers = useCallback(
        async ({ page = 1, limit = 10 } = {}) => {
            const response = await fetchAll({ page, limit });
            if (response?.success) {
                const data = response.data ?? {};
                setUsers(Array.isArray(data.users) ? data.users : []);
                setPagination({
                    ...defaultPagination,
                    ...data.pagination,
                });
            }
            return response;
        },
        [fetchAll],
    );

    const patchLocalUser = useCallback((userId, partial) => {
        setUsers((prev) =>
            prev.map((u) => (u._id === userId ? { ...u, ...partial } : u)),
        );
    }, []);

    const updateUserStatus = useCallback(
        async (userId, status) => {
            setStatusUpdatingId(userId);
            try {
                const res = await updateUserStatusApi(userId, status);
                const ok = res?.status >= 200 && res?.status < 300;
                if (ok) {
                    patchLocalUser(userId, { status });
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
        [patchLocalUser],
    );

    return {
        users,
        pagination,
        loading,
        error,
        fetchUsers,
        patchLocalUser,
        updateUserStatus,
        statusUpdatingId,
    };
};

export default useUsers;
