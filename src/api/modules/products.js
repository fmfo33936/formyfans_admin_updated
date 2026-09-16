import { endpoints } from "./endPoints";
import api from "../../api";

export const createProduct = (data) => {
    return api(endpoints.createProduct, data, "post");
};

export const getProducts = (params = {}) => {
    return api(endpoints.getProducts, params, "get");
};

export const updateProduct = (productId, data) => {
    const path = endpoints.updateProduct.replace(":id", String(productId));
    return api(path, data, "put");
};

export const deleteProduct = (productId) => {
    const path = endpoints.deleteProduct.replace(":id", String(productId));
    return api(path, {}, "delete");
};
