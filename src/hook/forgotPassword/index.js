import { useCallback } from "react";
import { useCrud } from "../common/useCrud";
import { forgotPassword } from "../../api/modules/forgotPassword";

export const useForgotPassword = () => {
  const crud = useCrud({
    createFn: forgotPassword,
  });

  const sendResetLink = useCallback(
    async (payload, successMessage = "") => {
      return crud.create(payload, successMessage);
    },
    [crud]
  );

  return {
    sendResetLink,
    loading: crud.loading,
    error: crud.error,
  };
};
