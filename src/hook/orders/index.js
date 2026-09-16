import { useCallback, useState } from "react";
import { toast } from "react-toastify";
import {
    changeOrderStatus,
    getOrderByOrderId,
    getOrders,
} from "../../api/modules/order";
import {
    getOrderApiId,
    getOrderRecordId,
    normalizeOrderDetail,
} from "../../utils/orderHelpers";
import { useCrud } from "../common/useCrud";

const defaultPagination = {
    page: 1,
    limit: 10,
    totalOrders: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false,
};

const parseOrdersList = (data) => {
    if (Array.isArray(data?.orders)) return data.orders;
    if (Array.isArray(data?.data?.orders)) return data.data.orders;
    if (Array.isArray(data)) return data;
    return [];
};

const parseOrderDetail = (data, requestedOrderId = "") => {
    if (!data) return null;

    if (data.order && !Array.isArray(data.order)) {
        return normalizeOrderDetail(data);
    }

    const list = data.orders ?? data.data?.orders;
    if (Array.isArray(list)) {
        if (requestedOrderId) {
            const match = list.find(
                (order) =>
                    getOrderApiId(order) === requestedOrderId ||
                    getOrderRecordId(order) === requestedOrderId,
            );
            if (match) return normalizeOrderDetail({ order: match });
        }
        return list.length === 1 ? normalizeOrderDetail({ order: list[0] }) : null;
    }

    return normalizeOrderDetail(data.data ?? data);
};

const useOrders = () => {
    const [orders, setOrders] = useState([]);
    const [pagination, setPagination] = useState(defaultPagination);
    const [orderDetail, setOrderDetail] = useState(null);
    const [detailLoading, setDetailLoading] = useState(false);
    const [statusUpdatingId, setStatusUpdatingId] = useState(null);

    const { fetchAll, loading, error } = useCrud({
        fetchFn: getOrders,
    });

    const fetchOrders = useCallback(
        async ({ page = 1, limit = 10 } = {}) => {
            const response = await fetchAll({ page, limit });
            if (response?.success) {
                const data = response.data ?? {};
                const list = parseOrdersList(data);
                setOrders(list);
                setPagination({
                    ...defaultPagination,
                    ...data.pagination,
                    totalOrders:
                        data.pagination?.totalOrders ??
                        data.totalOrders ??
                        list.length,
                });
            }
            return response;
        },
        [fetchAll],
    );

    const fetchOrderByOrderId = useCallback(async (orderId) => {
        if (!orderId) {
            toast.error("Order id is missing");
            return null;
        }
        setDetailLoading(true);
        try {
            const res = await getOrderByOrderId(orderId);
            const ok = res?.status >= 200 && res?.status < 300;
            if (!ok) {
                const message = res?.data?.message || "Failed to load order details";
                toast.error(message);
                return null;
            }
            const detail = parseOrderDetail(res?.data, orderId);
            if (!detail) {
                toast.error("Order details not found");
                return null;
            }
            setOrderDetail(detail);
            return detail;
        } catch (err) {
            const message =
                err?.response?.data?.message || err?.message || "Something went wrong";
            toast.error(message);
            return null;
        } finally {
            setDetailLoading(false);
        }
    }, []);

    const patchLocalOrderStatus = useCallback((orderRecordId, status) => {
        setOrders((prev) =>
            prev.map((order) =>
                getOrderRecordId(order) === orderRecordId
                    ? { ...order, status, orderStatus: status }
                    : order,
            ),
        );
        setOrderDetail((prev) =>
            prev && getOrderRecordId(prev) === orderRecordId
                ? { ...prev, status, orderStatus: status }
                : prev,
        );
    }, []);

    const updateOrderStatus = useCallback(
        async (orderRecordId, status) => {
            if (!orderRecordId) {
                toast.error("Order id is missing");
                return { success: false };
            }
            setStatusUpdatingId(orderRecordId);
            try {
                const res = await changeOrderStatus(orderRecordId, status);
                const ok = res?.status >= 200 && res?.status < 300;
                if (ok) {
                    patchLocalOrderStatus(orderRecordId, status);
                    const msg = res?.data?.message;
                    if (msg) toast.success(msg);
                    return { success: true, data: res?.data };
                }
                const message = res?.data?.message || "Failed to update order status";
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
                setStatusUpdatingId(null);
            }
        },
        [patchLocalOrderStatus],
    );

    return {
        orders,
        pagination,
        loading,
        error,
        orderDetail,
        detailLoading,
        statusUpdatingId,
        fetchOrders,
        fetchOrderByOrderId,
        updateOrderStatus,
    };
};

export default useOrders;
