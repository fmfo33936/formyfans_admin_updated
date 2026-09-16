export const formatCampaignDate = (iso) => {
    if (!iso) return "—";
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "—";
    return d.toLocaleDateString(undefined, {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
};

const readRefName = (value) => {
    if (!value) return "—";
    if (typeof value === "string") return value;
    return value.name ?? value.title ?? value.label ?? "—";
};

const readCreatorName = (user) => {
    if (!user) return "—";
    if (typeof user === "string") return user;
    const full = [user.firstName, user.lastName].filter(Boolean).join(" ").trim();
    if (full) return full;
    if (user.username) return `@${user.username}`;
    if (user.email) return user.email;
    return "—";
};

export const formatCampaignBudget = (campaign) => {
    if (!campaign) return "—";
    const type = campaign.budgetType ?? campaign.budget?.type;
    const daily = campaign.dailyBudget ?? campaign.budget?.daily;
    const total = campaign.totalBudget ?? campaign.budget?.total ?? campaign.budget;

    if (type === "daily" && daily != null) {
        return `$${Number(daily).toLocaleString()} / day`;
    }
    if (total != null && typeof total !== "object") {
        return `$${Number(total).toLocaleString()}`;
    }
    if (daily != null) {
        return `$${Number(daily).toLocaleString()} / day`;
    }
    return "—";
};

export const getCampaignStatusStyle = (status) => {
    const key = String(status || "").toLowerCase();
    switch (key) {
        case "active":
        case "running":
        case "live":
            return { bgcolor: "rgba(12, 169, 4, 0.12)", color: "#0CA904" };
        case "scheduled":
        case "pending":
            return { bgcolor: "rgba(245, 124, 0, 0.12)", color: "#F57C00" };
        case "paused":
            return { bgcolor: "rgba(123, 31, 162, 0.12)", color: "#7B1FA2" };
        case "completed":
        case "ended":
            return { bgcolor: "rgba(25, 118, 210, 0.12)", color: "#1976D2" };
        case "cancelled":
        case "rejected":
        case "failed":
            return { bgcolor: "rgba(211, 47, 47, 0.12)", color: "#D32F2F" };
        default:
            return { bgcolor: "rgba(94, 19, 33, 0.1)", color: "#5E1321" };
    }
};

export const mapCampaignToTableRow = (campaign) => ({
    id: campaign?._id,
    _id: campaign?._id,
    name: campaign?.name || "—",
    brand: campaign?.brand || "—",
    objective: readRefName(campaign?.objective),
    category: readRefName(campaign?.category),
    budget: formatCampaignBudget(campaign),
    status: campaign?.status || "—",
    launchType: campaign?.launchType || "—",
    startDate: formatCampaignDate(campaign?.startDateTime ?? campaign?.startDate),
    endDate: formatCampaignDate(campaign?.endDateTime ?? campaign?.endDate),
    createdBy: readCreatorName(campaign?.createdBy ?? campaign?.user ?? campaign?.owner),
    createdAt: formatCampaignDate(campaign?.createdAt),
});
