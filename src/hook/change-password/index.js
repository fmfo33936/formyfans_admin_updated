import { useCallback } from "react";
import { useCrud } from "../common/useCrud";
import { changePassword as changePasswordApi } from "../../api/modules/changePassword";

export const useChangePassword = () => {
  const crud = useCrud({
    createFn: changePasswordApi,
  });

  const changePassword = useCallback(
    async (payload, successMessage = "Password updated successfully") => {
      return crud.create(payload, successMessage);
    },
    [crud]
  );

  return { changePassword, loading: crud.loading, error: crud.error };
};
