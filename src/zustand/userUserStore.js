import { create } from "zustand";
import { persist } from "zustand/middleware";

/** Set after `create` so `clearUserData` can call `persist.clearStorage()`. */
let useUserStoreRef;

const useUserStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      setUserData: (user) => set({ user }),
      setToken: (token) => set({ token }),
      setAuthData: ({ user, token }) => set({ user, token }),
      clearUserData: () => {
        set({ user: null, token: null });
        localStorage.removeItem("token");
        try {
          useUserStoreRef?.persist?.clearStorage();
        } catch {
          localStorage.removeItem("userData");
        }
      },
    }),
    {
      name: "userData",
    }
  )
);

useUserStoreRef = useUserStore;

export default useUserStore;
