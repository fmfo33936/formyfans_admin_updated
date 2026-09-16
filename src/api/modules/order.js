import { endpoints } from "./endPoints";
import api from "../../api";


export const getOrders = (params = {}) => {
    return api(endpoints.getOrders, params, "get");
};

export const getOrderByOrderId = (orderId) => {
    return api(endpoints.getOrderById.replace(":id", orderId), {}, "get");
};

export const changeOrderStatus = (orderId, status) => {
    return api(endpoints.changeOrderStatus.replace(":orderId", orderId), { status }, "patch");
};