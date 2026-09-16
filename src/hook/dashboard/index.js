import { useCallback, useState } from "react";
import { useCrud } from "../common/useCrud";
import { getDashboardData as getDashboardDataApi } from "../../api/modules/dashboard";

export const useDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);

  const { fetchAll, loading, error } = useCrud({
    fetchFn: getDashboardDataApi,
  });

  const fetchDashboard = useCallback(
    async (params = {}) => {
      const response = await fetchAll(params);
      if (response?.success) {
        setDashboardData(response.data ?? null);
      }
      return response;
    },
    [fetchAll]
  );

  return {
    dashboardData,
    loading,
    error,
    fetchDashboard,
  };
};

export default useDashboard;
