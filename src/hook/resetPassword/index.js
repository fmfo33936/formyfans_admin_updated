import { useCallback } from "react";
import { useCrud } from "../common/useCrud";
import { resetPassword as resetPasswordRequest } from "../../api/modules/resetPassword";

export const useResetPassword = () => {
  const crud = useCrud({
    createFn: resetPasswordRequest,
  });

  const submitReset = useCallback(
    async (payload, successMessage = "") => {
      return crud.create(payload, successMessage);
    },
    [crud]
  );

  return {
    submitReset,
    loading: crud.loading,
    error: crud.error,
  };
};
