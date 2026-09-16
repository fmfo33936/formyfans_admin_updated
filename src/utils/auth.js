import useUserStore from "../zustand/userUserStore";

/**
 * Auth token check for route guards.
 * Only treat a real non-empty string as logged in.
 */
export const getAuthToken = () => {
  try {
    const fromStorage = localStorage.getItem("token");
    if (typeof fromStorage === "string" && fromStorage.trim()) {
      return fromStorage.trim();
    }
  } catch {
    // ignore storage errors
  }

  const fromStore = useUserStore.getState().token;
  if (typeof fromStore === "string" && fromStore.trim()) {
    return fromStore.trim();
  }

  return null;
};

export const isAuthenticated = () => Boolean(getAuthToken());
