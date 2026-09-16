import { useCallback } from "react";
import { useCrud } from "../common/useCrud";
import { verifyOtp } from "../../api/modules/verifyOtp";

export const useVerifyOtp = () => {
  const crud = useCrud({
    createFn: verifyOtp,
  });

  const verify = useCallback(
    async (payload, successMessage = "") => {
      return crud.create(payload, successMessage);
    },
    [crud]
  );

  return {
    verify,
    loading: crud.loading,
    error: crud.error,
  };
};
