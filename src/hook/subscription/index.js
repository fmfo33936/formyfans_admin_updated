import { useCallback, useState } from "react";
import { toast } from "react-toastify";
import {
    getSubscriptionPlans as getSubscriptionPlansApi,
    updateSubscriptionPlan as updateSubscriptionPlanApi,
} from "../../api/modules/subscription";
import { useCrud } from "../common/useCrud";

export const useSubscription = () => {
    const [subscriptionPlans, setSubscriptionPlans] = useState([]);
    const [updateLoading, setUpdateLoading] = useState(false);

    const { fetchAll, loading, error } = useCrud({
        fetchFn: getSubscriptionPlansApi,
    });

    const getSubscriptionPlans = useCallback(async () => {
        const response = await fetchAll();
        if (response?.success) {
            const raw = response?.data;
            const plansData = Array.isArray(raw)
                ? raw
                : raw?.plans ?? raw?.subscriptionPlans ?? [];
            setSubscriptionPlans(Array.isArray(plansData) ? plansData : []);
        }
        return response;
    }, [fetchAll]);

    const updateSubscriptionPlan = useCallback(
        async (planId, data) => {
            setUpdateLoading(true);
            try {
                const res = await updateSubscriptionPlanApi(planId, data);
                const ok = res?.status >= 200 && res?.status < 300;
                if (ok) {
                    const msg = res?.data?.message;
                    if (msg) toast.success(msg);
                    else toast.success("Plan updated successfully");
                    await getSubscriptionPlans();
                    return { success: true, data: res?.data };
                }
                const message = res?.data?.message || "Request failed";
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
                setUpdateLoading(false);
            }
        },
        [getSubscriptionPlans],
    );

    return {
        subscriptionPlans,
        loading,
        updateLoading,
        error,
        getSubscriptionPlans,
        updateSubscriptionPlan,
    };
};

export default useSubscription;
