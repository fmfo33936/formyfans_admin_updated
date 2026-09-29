import { useCallback, useState } from "react";
import { toast } from "react-toastify";
import {
    getCreditPricing as getCreditPricingApi,
    updateCreditPricing as updateCreditPricingApi,
} from "../../api/modules/credits";

export const useCreditPricing = () => {
    const [creditPricing, setCreditPricing] = useState(null);
    const [loading, setLoading] = useState(false);
    const [updateLoading, setUpdateLoading] = useState(false);
    const [error, setError] = useState("");

    const fetchCreditPricing = useCallback(async () => {
        setLoading(true);
        setError("");
        try {
            const res = await getCreditPricingApi();
            const isSuccess = res?.status >= 200 && res?.status < 300;

            if (!isSuccess) {
                const errMsg = res?.data?.message || "Failed to load credit pricing";
                setError(errMsg);
                return { success: false, message: errMsg };
            }

            const responseData = res?.data?.data !== undefined ? res.data.data : res?.data;
            setCreditPricing(responseData || null);
            return { success: true, data: responseData };
        } catch (err) {
            const message =
                err?.response?.data?.message ||
                err?.message ||
                "Failed to fetch credit pricing";
            setError(message);
            toast.error(message);
            return { success: false, message };
        } finally {
            setLoading(false);
        }
    }, []);

    const updateCreditPricing = useCallback(async (payload) => {
        setUpdateLoading(true);
        try {
            const res = await updateCreditPricingApi(payload);
            const isSuccess = res?.status >= 200 && res?.status < 300;

            if (isSuccess) {
                const msg = res?.data?.message || "Credit pricing updated successfully";
                toast.success(msg);
                const updatedData = res?.data?.data !== undefined ? res.data.data : res?.data;
                if (updatedData) {
                    setCreditPricing(updatedData);
                } else {
                    await fetchCreditPricing();
                }
                return { success: true, data: updatedData };
            }

            const errMsg = res?.data?.message || "Failed to update credit pricing";
            toast.error(errMsg);
            return { success: false, message: errMsg };
        } catch (err) {
            const message =
                err?.response?.data?.message ||
                err?.message ||
                "Something went wrong while updating credit pricing";
            toast.error(message);
            return { success: false, message };
        } finally {
            setUpdateLoading(false);
        }
    }, [fetchCreditPricing]);

    return {
        creditPricing,
        loading,
        updateLoading,
        error,
        fetchCreditPricing,
        updateCreditPricing,
    };
};

export default useCreditPricing;
