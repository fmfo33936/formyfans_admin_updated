import { Box, Typography, Avatar } from "@mui/material";
import { useEffect, useState } from "react";
import Notification from "../../assets/icon/notification.svg";
import ProfilePopup from "../profilePopup";
import NotificationPopup from "../notificationPopup";
import {
    getAvatarInitials,
    getDisplayName,
    getProfileImageUrl,
    useProfile,
} from "../../hook/profile";
import useUserStore from "../../zustand/userUserStore";

/** Pass `sidebarCollapsed` on pages with a fixed left sidebar: bar is inset with a gap after the sidebar and matching right gutter (same rhythm as MainContent padding). Omit on layouts where the header is already offset. */
const Header = ({ children = false, sidebarCollapsed }) => {
    const [profileAnchorEl, setProfileAnchorEl] = useState(null);
    const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
    const storedUser = useUserStore((state) => state.user);
    const token = useUserStore((state) => state.token);
    const { fetchProfile } = useProfile();

    useEffect(() => {
        const hasToken = Boolean(token || localStorage.getItem("token"));
        if (!hasToken || storedUser) return;
        fetchProfile();
    }, [storedUser, token, fetchProfile]);

    const displayName = getDisplayName(storedUser);
    const avatarSrc = getProfileImageUrl(storedUser);
    const avatarInitials = getAvatarInitials(storedUser);

    const handleProfileClick = (event) => {
        setProfileAnchorEl(event.currentTarget);
    };

    const handleProfileClose = () => {
        setProfileAnchorEl(null);
    };

    const handleNotificationClick = (event) => {
        setNotificationAnchorEl(event.currentTarget);
    };

    const handleNotificationClose = () => {
        setNotificationAnchorEl(null);
    };

    /** Fixed sidebar width + same horizontal inset as admin MainContent padding so the bar sits centered in the gray column with a visible gap after the pink sidebar. */
    const mainGutter = 24;
    const sidebarEdge =
        sidebarCollapsed === undefined
            ? null
            : sidebarCollapsed
              ? "80px"
              : "250px";

    return (
        <Box
            sx={{
                bgcolor: "white",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                borderRadius: 20,
                mt: { xs: 2, md: 2 },
                mb: { xs: 2, md: 2 },
                ml:
                    sidebarEdge !== null
                        ? { xs: 2, md: `calc(${sidebarEdge} + ${mainGutter}px)` }
                        : { xs: 2, md: 2 },
                mr: sidebarEdge !== null ? { xs: 2, md: `${mainGutter}px` } : { xs: 2, md: 2 },
                pl: { xs: 2, md: 0 },
                width: "auto",
                maxWidth: "100%",
                boxSizing: "border-box",
                transition: "margin-left 0.3s ease, margin-right 0.3s ease",
                mt: "20px",
            }}
        >
            <Box display="flex" justifyContent="flex-end" alignItems="center" px={4} py={2}>
                <Box display="flex" gap={{ xs: "15px", md: "30px" }} alignItems="center">
                    <Box
                        component="img"
                        src={Notification}
                        sx={{
                            width: 22,
                            height: 22,
                            cursor: "pointer",
                            opacity: 0.8,
                            transition: "all 0.2s ease",
                            "&:hover": {
                                opacity: 1,
                                transform: "scale(1.05)",
                            },
                        }}
                        onClick={handleNotificationClick}
                    />

                    <Box
                        display="flex"
                        alignItems="center"
                        gap="15px"
                        onClick={handleProfileClick}
                        sx={{ cursor: "pointer" }}
                    >
                        <Typography
                            fontWeight={600}
                            fontSize="15px"
                            color="#333"
                            sx={{ display: { xs: "none", md: "block" } }}
                        >
                            {displayName}
                        </Typography>
                        <Avatar
                            src={avatarSrc || undefined}
                            sx={{
                                width: 36,
                                height: 36,
                                bgcolor: "#FF1572",
                                fontSize: 14,
                                fontWeight: 700,
                                border: "2px solid rgba(255, 21, 114, 1)",
                            }}
                        >
                            {!avatarSrc ? avatarInitials : null}
                        </Avatar>
                    </Box>
                </Box>
            </Box>
            {children}

            <ProfilePopup
                anchorEl={profileAnchorEl}
                onClose={handleProfileClose}
                profile={storedUser}
            />

            <NotificationPopup
                anchorEl={notificationAnchorEl}
                onClose={handleNotificationClose}
            />
        </Box>
    );
};

export default Header;
