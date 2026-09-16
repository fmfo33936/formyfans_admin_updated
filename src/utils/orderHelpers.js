/** Shared order field helpers — API shape → UI labels */

export const formatOrderDate = (value) => {
    if (!value) return "—";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return String(value);
    return date.toLocaleDateString(undefined, {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });
};

export const formatOrderPrice = (value) => {
    if (value == null || value === "") return "—";
    const amount = Number(value);
    if (Number.isNaN(amount)) return String(value);
    return `$${amount.toFixed(2)}`;
};

/** Database id from order document (Mongo `_id`) */
export const getOrderRecordId = (order) => order?._id ?? order?.id ?? "";

/** Public order id for API routes (e.g. ORD-000003) */
export const getOrderApiId = (order) => {
    if (order?.orderId && !String(order.orderId).match(/^[a-f0-9]{24}$/i)) {
        return String(order.orderId);
    }
    if (order?.orderNumber) return String(order.orderNumber);
    return "";
};

/** Short code shown in table (e.g. #A3DF9B) */
export const getOrderDisplayCode = (order) => {
    const recordId = getOrderRecordId(order);
    if (order?.orderId && !String(order.orderId).match(/^[a-f0-9]{24}$/i)) {
        return String(order.orderId);
    }
    if (order?.orderNumber) return String(order.orderNumber);
    return recordId ? `#${String(recordId).slice(-6).toUpperCase()}` : "—";
};

const getDeliveryFromOrder = (order) =>
    order?.delivery ?? order?.orderDetails?.delivery ?? null;

export const getOrderBillingName = (order) => {
    const delivery = getDeliveryFromOrder(order);
    if (delivery?.name?.trim()) return delivery.name.trim();
    if (order?.buyer?.fullName?.trim()) return order.buyer.fullName.trim();
    if (order?.buyer) {
        const buyerName = [order.buyer.firstName, order.buyer.lastName]
            .filter(Boolean)
            .join(" ")
            .trim();
        if (buyerName) return buyerName;
    }
    if (order?.userId) {
        const customerName = [order.userId.firstName, order.userId.lastName]
            .filter(Boolean)
            .join(" ")
            .trim();
        if (customerName) return customerName;
    }
    return order?.billingName ?? "—";
};

export const getOrderStatusLabel = (order) =>
    order?.status ?? order?.orderStatus ?? "—";

export const ORDER_STATUS = {
    PENDING: "pending",
    ACCEPTED: "accepted",
    IN_PROGRESS: "in_progress",
    DELIVERED: "delivered",
    COMPLETED: "completed",
    CANCELLED: "cancelled",
};

export const normalizeOrderStatusKey = (status) => {
    const raw = String(status ?? "").toLowerCase().trim();
    if (!raw || raw === "—") return "";
    if (raw === "inprocess" || raw === "in process") return ORDER_STATUS.IN_PROGRESS;
    if (raw === ORDER_STATUS.COMPLETED) return ORDER_STATUS.DELIVERED;
    return raw.replace(/\s+/g, "_");
};

/** UI label for API `status` */
export const formatOrderStatusDisplay = (status) => {
    const key = normalizeOrderStatusKey(status);
    if (!key) return "—";
    const labels = {
        [ORDER_STATUS.PENDING]: "Pending",
        [ORDER_STATUS.ACCEPTED]: "Accepted",
        [ORDER_STATUS.IN_PROGRESS]: "In Progress",
        [ORDER_STATUS.DELIVERED]: "Delivered",
        [ORDER_STATUS.CANCELLED]: "Cancelled",
    };
    return labels[key] ?? String(status).replace(/_/g, " ");
};

/** Theme chip colors per status */
export const getOrderStatusChipStyle = (status) => {
    const key = normalizeOrderStatusKey(status);
    switch (key) {
        case ORDER_STATUS.PENDING:
            return { backgroundColor: "rgba(255, 107, 157, 0.28)", color: "#B91350" };
        case ORDER_STATUS.ACCEPTED:
            return { backgroundColor: "rgba(94, 19, 33, 0.1)", color: "#5E1321" };
        case ORDER_STATUS.IN_PROGRESS:
            return { backgroundColor: "rgba(255, 21, 114, 0.22)", color: "#E0106A" };
        case ORDER_STATUS.DELIVERED:
            return { backgroundColor: "rgba(94, 19, 33, 0.2)", color: "#5E1321" };
        case ORDER_STATUS.CANCELLED:
            return { backgroundColor: "rgba(117, 117, 117, 0.16)", color: "#616161" };
        default:
            return { backgroundColor: "rgba(117, 117, 117, 0.14)", color: "#757575" };
    }
};

/** Flatten single-order API (`order` + `orderDetails`) for detail screen */
export const normalizeOrderDetail = (payload) => {
    if (!payload) return null;

    const root = payload.order ?? payload;
    if (!root || typeof root !== "object") return null;

    const details = root.orderDetails ?? {};
    const items = details.items ?? root.items ?? [];
    const delivery = details.delivery ?? root.delivery ?? null;

    return {
        ...root,
        orderId: root.orderId ?? payload.orderId,
        status: root.status,
        createdAt: root.placedAt ?? root.createdAt,
        updatedAt: root.updatedAt,
        items,
        delivery,
        paymentMethod: details.payment?.method ?? root.paymentMethod,
        subtotal: details.subtotal ?? root.subtotal,
        discountAmount: details.discountAmount ?? root.discountAmount,
        shippingCharges: details.shippingCharges ?? root.shippingCharges,
        estimatedTax: details.estimatedTax ?? root.estimatedTax,
        totalAmount: details.totalAmount ?? root.totalAmount,
        productIds: details.productIds ?? root.productIds,
        buyer: root.buyer,
        seller: root.seller,
        userId: root.buyer
            ? {
                  _id: root.buyer.id,
                  firstName: root.buyer.firstName,
                  lastName: root.buyer.lastName,
                  email: root.buyer.email,
              }
            : root.userId,
    };
};

export const getOrderItems = (order) => {
    const items = order?.items ?? order?.orderDetails?.items;
    return Array.isArray(items) ? items : [];
};

export const getOrderTotalQuantity = (order) => {
    const items = getOrderItems(order);
    if (!items.length) return "—";
    return items.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);
};

export const getFirstProductId = (order) => {
    const items = getOrderItems(order);
    return items[0]?.productId ?? order?.productIds?.[0] ?? "";
};

export const mapOrderToTableRow = (order, index = 0) => {
    const orderRecordId = getOrderRecordId(order);

    return {
        id: orderRecordId || index,
        orderRecordId,
        orderApiId: getOrderApiId(order),
        productId: getFirstProductId(order),
        orderDisplayCode: getOrderDisplayCode(order),
        billingName: getOrderBillingName(order),
        status: getOrderStatusLabel(order),
        totalAmount: formatOrderPrice(order?.totalAmount ?? order?.totalPricing),
        orderDate: formatOrderDate(order?.createdAt ?? order?.date),
        quantity: getOrderTotalQuantity(order),
    };
};

export const getOrderSummaryData = (order) => {
    if (!order) {
        return {
            subtotal: "—",
            discount: "—",
            shipping: "—",
            tax: "—",
            totalAmount: "—",
        };
    }

    const details = order.orderDetails ?? {};
    const subtotalRaw = order.subtotal ?? details.subtotal;
    const discountRaw = order.discountAmount ?? details.discountAmount;
    const shippingRaw = order.shippingCharges ?? details.shippingCharges;
    const taxRaw = order.estimatedTax ?? details.estimatedTax;
    const totalRaw = order.totalAmount ?? details.totalAmount;

    const discountFormatted = formatOrderPrice(discountRaw);

    return {
        subtotal: formatOrderPrice(subtotalRaw),
        discount:
            discountFormatted === "—"
                ? "—"
                : `-${discountFormatted.replace(/^\$/, "")}`,
        shipping: formatOrderPrice(shippingRaw),
        tax: formatOrderPrice(taxRaw),
        totalAmount: formatOrderPrice(totalRaw),
    };
};

export const mapOrderItemToRow = (item, index = 0) => ({
    id: item?._id ?? item?.productId ?? index,
    name: item?.product?.name ?? item?.name ?? item?.productId ?? "—",
    quantity: Number(item?.quantity) || 0,
    price: Number(item?.unitPrice ?? item?.price) || 0,
});
