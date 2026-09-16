export const DEAL_STATUS = {
    PENDING: "pending",
    ACCEPTED: "accepted",
    STARTED: "started",
    VERIFYING: "verifying",
    COMPLETED: "completed",
    INCOMPLETE: "incomplete",
    REJECTED: "rejected",
    CANCELLED: "cancelled",
    PAUSED: "paused",
};

export const DEAL_STATUS_OPTIONS = [
    { value: "", label: "All Status" },
    ...Object.values(DEAL_STATUS).map((value) => ({
        value,
        label: value.replace(/-/g, " "),
    })),
];

export const formatDealDate = (iso) => {
    if (!iso) return "—";
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "—";
    return d.toLocaleDateString(undefined, {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
};

export const formatDealDateTime = (iso) => {
    if (!iso) return "—";
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "—";
    return d.toLocaleString(undefined, {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};

export const formatPersonName = (person) => {
    if (!person) return "—";
    const full = [person.firstName, person.lastName].filter(Boolean).join(" ").trim();
    if (full) return full;
    if (person.username) return `@${person.username}`;
    return "—";
};

export const formatDeliverables = (items) => {
    if (!Array.isArray(items) || items.length === 0) return "—";
    return items
        .map((item) => {
            const type = item?.type ?? "item";
            const done = item?.completed ?? 0;
            const total = item?.count ?? 0;
            return `${type} ${done}/${total}`;
        })
        .join(", ");
};

export const formatAmount = (amount, currency = "USD") => {
    if (amount == null || amount === "") return "—";
    const num = Number(amount);
    if (Number.isNaN(num)) return String(amount);
    return `${currency} ${num.toLocaleString()}`;
};

export const getDealStatusStyle = (status) => {
    const key = String(status || "").toLowerCase();
    switch (key) {
        case DEAL_STATUS.COMPLETED:
            return { bgcolor: "rgba(12, 169, 4, 0.12)", color: "#0CA904" };
        case DEAL_STATUS.STARTED:
        case DEAL_STATUS.ACCEPTED:
            return { bgcolor: "rgba(25, 118, 210, 0.12)", color: "#1976D2" };
        case DEAL_STATUS.VERIFYING:
            return { bgcolor: "rgba(245, 124, 0, 0.12)", color: "#F57C00" };
        case DEAL_STATUS.PENDING:
            return { bgcolor: "rgba(117, 117, 117, 0.12)", color: "#757575" };
        case DEAL_STATUS.INCOMPLETE:
        case DEAL_STATUS.REJECTED:
        case DEAL_STATUS.CANCELLED:
            return { bgcolor: "rgba(211, 47, 47, 0.12)", color: "#D32F2F" };
        case DEAL_STATUS.PAUSED:
            return { bgcolor: "rgba(123, 31, 162, 0.12)", color: "#7B1FA2" };
        default:
            return { bgcolor: "rgba(94, 19, 33, 0.1)", color: "#5E1321" };
    }
};

export const getPaymentStatusStyle = (status) => {
    const key = String(status || "").toLowerCase();
    if (key === "paid") {
        return { bgcolor: "rgba(12, 169, 4, 0.12)", color: "#0CA904" };
    }
    if (key === "pending" || key === "unpaid") {
        return { bgcolor: "rgba(245, 124, 0, 0.12)", color: "#F57C00" };
    }
    return { bgcolor: "rgba(117, 117, 117, 0.12)", color: "#757575" };
};

export const isIncompleteDeal = (status) =>
    String(status || "").toLowerCase() === DEAL_STATUS.INCOMPLETE;

export const mapDealToTableRow = (deal) => ({
    id: deal?._id,
    _id: deal?._id,
    title: deal?.title || "—",
    sender: deal?.sender ?? null,
    receiver: deal?.receiver ?? null,
    amount: formatAmount(deal?.amount, deal?.currency),
    status: deal?.status || "—",
    paymentStatus: deal?.paymentStatus || "—",
});

export const parseDealDetail = (data) => {
    if (!data) return null;
    if (data.deal && typeof data.deal === "object" && !Array.isArray(data.deal)) {
        return data.deal;
    }
    if (data.data?.deal && typeof data.data.deal === "object") {
        return data.data.deal;
    }
    if (data.data && typeof data.data === "object" && !Array.isArray(data.data)) {
        if (data.data._id || data.data.title || data.data.status) {
            return data.data;
        }
    }
    if (data._id || data.title || data.status) return data;
    return null;
};
