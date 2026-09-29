import axios from "axios";
import useUserStore from "../zustand/userUserStore";

// export const baseUrl =
//   "https://formyfansonly-backend-staging-a27a863fb6c8.herokuapp.com/api/";
// "https://n6gk58dw-5009.inc1.devtunnels.ms/api/";
export const baseUrl = `${import.meta.env.VITE_BASE_URL}/api/`;

const api = async (path, params, method, isMultipart = false) => {
  let userToken = localStorage.getItem("token") || useUserStore.getState()?.token;
  if (typeof userToken === "string") {
    userToken = userToken.replace(/^"(.*)"$/, "$1").trim();
  }

  // Handle query parameters for GET requests
  let url = path;
  if (method === "get" && params) {
    const queryParams = new URLSearchParams();
    Object.keys(params).forEach((key) => {
      if (
        params[key] !== null &&
        params[key] !== undefined &&
        params[key] !== ""
      ) {
        queryParams.append(key, params[key]);
      }
    });
    const queryString = queryParams.toString();
    if (queryString) {
      url = `${path}?${queryString}`;
    }
  }

  const options = {
    headers: {
      ...(userToken && {
        Authorization: `Bearer ${userToken}`,
      }),
    },
    method,
    // For GET requests, params go in URL, for others in body
    ...(method !== "get" &&
      params && {
      data: params,
    }),
  };

  if (!isMultipart) {
    options.headers["Content-Type"] = "application/json";
  }

  try {
    const response = await axios(baseUrl + url, options);
    return response;
  } catch (error) {
    console.error("❌ API Error:", error);

    // if (error.response?.status === 401) {
    //   showModal("Your session has expired. You are being logged out.", () => {
    //     useUserStore.getState().clearUserData();
    //     window.location.href = "/login";
    //   });
    // }

    return (
      error.response || { status: 500, data: { message: "Unknown error" } }
    );
  }
};

export default api;
