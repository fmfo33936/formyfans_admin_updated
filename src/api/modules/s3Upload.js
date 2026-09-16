import api from "../index";
import { endpoints } from "./endPoints";

export const getPresignedUrlApi = async (fileName , fileType , folder ) => {
  return api(endpoints.upload, { fileName, fileType, folder }, "post");
};
