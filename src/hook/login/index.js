import { useCrud } from "../common/useCrud";
import { adminLogin } from "../../api/modules/login";
import { useCallback } from "react";

export const useLogin = () => {
    const crud = useCrud({
        createFn: adminLogin,
    });

    const login = useCallback(async (payload, successMessage = "") => {
        return crud.create(payload, successMessage);
    }, [crud]);

    return { login, loading: crud.loading, error: crud.error };
}