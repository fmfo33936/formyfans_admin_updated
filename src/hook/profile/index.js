import { useCallback, useState } from "react";
import { toast } from "react-toastify";
import {
    getProfile as getProfileApi,
    updateProfile as updateProfileApi,
} from "../../api/modules/profile";
import { getFullS3Url } from "../../utils/s3Helper";
import useUserStore from "../../zustand/userUserStore";

let profileFetchPromise = null;

const parseProfile = (payload) => {
    if (!payload || typeof payload !== "object") return null;
    const source =
        payload.admin ||
        payload.user ||
        payload.profile ||
        payload.data?.admin ||
        payload.data?.user ||
        payload.data?.profile ||
        (payload.data && typeof payload.data === "object" && !Array.isArray(payload.data)
            ? payload.data
            : null) ||
        payload;

    if (!source || typeof source !== "object" || Array.isArray(source)) return null;
    return source;
};

export const getDisplayName = (profile) => {
    if (!profile) return "Admin";
    const full = [profile.firstName, profile.lastName].filter(Boolean).join(" ").trim();
    return (
        profile.username ||
        full ||
        profile.name ||
        profile.fullName ||
        profile.email ||
        "Admin"
    );
};

export const getAvatarInitials = (profile) => {
    const name = getDisplayName(profile);
    if (!name || name === "Admin") return "A";
    const parts = String(name).trim().split(/\s+/).filter(Boolean);
    if (parts.length >= 2) {
        return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return String(parts[0] || "A").slice(0, 2).toUpperCase();
};

export const getProfileImageUrl = (profile) => {
    const raw = profile?.image || profile?.avatar || profile?.profileImage || "";
    if (!raw) return "";
    return getFullS3Url(String(raw));
};

export const useProfile = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [updateLoading, setUpdateLoading] = useState(false);
    const setUserData = useUserStore((state) => state.setUserData);
    const storedUser = useUserStore((state) => state.user);

    const fetchProfile = useCallback(
        async ({ force = false } = {}) => {
            const hasToken = Boolean(
                useUserStore.getState().token || localStorage.getItem("token"),
            );
            if (!hasToken) {
                return null;
            }

            if (!force && profileFetchPromise) {
                return profileFetchPromise;
            }

            setLoading(true);
            profileFetchPromise = (async () => {
                try {
                    const res = await getProfileApi();
                    const ok = res?.status >= 200 && res?.status < 300;
                    if (!ok) {
                        // Logout / missing token — don't spam toast
                        if (res?.status === 401 || res?.status === 403) {
                            return null;
                        }
                        toast.error(res?.data?.message || "Failed to load profile");
                        return null;
                    }

                    const parsed = parseProfile(res?.data);
                    if (!parsed) {
                        toast.error("Profile not found");
                        return null;
                    }

                    setProfile(parsed);
                    setUserData(parsed);
                    return parsed;
                } catch (err) {
                    const status = err?.response?.status;
                    if (status === 401 || status === 403) {
                        return null;
                    }
                    toast.error(
                        err?.response?.data?.message ||
                            err?.message ||
                            "Something went wrong",
                    );
                    return null;
                } finally {
                    setLoading(false);
                    profileFetchPromise = null;
                }
            })();

            return profileFetchPromise;
        },
        [setUserData],
    );

    const saveProfile = useCallback(
        async ({ username, image } = {}) => {
            const trimmed = String(username || "").trim();
            if (!trimmed) {
                toast.error("Username is required");
                return { success: false };
            }

            const payload = { username: trimmed };
            if (image !== undefined && image !== null && image !== "") {
                payload.image = image;
            }

            setUpdateLoading(true);
            try {
                const res = await updateProfileApi(payload);
                const ok = res?.status >= 200 && res?.status < 300;
                if (!ok) {
                    toast.error(res?.data?.message || "Failed to update profile");
                    return { success: false };
                }

                toast.success(res?.data?.message || "Profile updated successfully");
                const parsed = parseProfile(res?.data) || {
                    ...(profile || storedUser || {}),
                    username: trimmed,
                    ...(payload.image ? { image: payload.image } : {}),
                };
                setProfile(parsed);
                setUserData(parsed);
                return { success: true, data: parsed };
            } catch (err) {
                toast.error(
                    err?.response?.data?.message ||
                        err?.message ||
                        "Something went wrong",
                );
                return { success: false };
            } finally {
                setUpdateLoading(false);
            }
        },
        [profile, storedUser, setUserData],
    );

    return {
        profile: profile || storedUser,
        loading,
        updateLoading,
        fetchProfile,
        saveProfile,
    };
};

export default useProfile;
