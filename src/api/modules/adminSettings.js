import api from "../../api";
import { endpoints } from "./endPoints";

export const getAdminSettings = (params = {}) => {
  return api(endpoints.adminSettings, params, "get");
};
