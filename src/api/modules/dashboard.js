import { endpoints } from "./endPoints";
import api from "../../api";

export const getDashboardData = (params = {}) => {
  return api(endpoints.dashboard, params, "get");
};
