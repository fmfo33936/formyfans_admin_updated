import { Box, Typography, Avatar, Divider, Menu, MenuItem } from "@mui/material";
import { useNavigate } from "react-router-dom";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import useUserStore from "../../zustand/userUserStore";
import {
    getAvatarInitials,
    getDisplayName,
    getProfileImageUrl,
} from "../../hook/profile";

const ProfilePopup = ({ anchorEl, onClose, profile }) => {
    const navigate = useNavigate();
    const clearUserData = useUserStore((state) => state.clearUserData);
    const storedUser = useUserStore((state) => state.user);
    const open = Boolean(anchorEl);

    const user = profile || storedUser;
    const displayName = getDisplayName(user);
    const displayEmail = user?.email || "—";
    const avatarSrc = getProfileImageUrl(user);
    const avatarInitials = getAvatarInitials(user);

    const handleClose = () => {
        onClose();
    };

    const handleSettings = () => {
        navigate("/app/settings");
        handleClose();
    };

    const handleLogout = () => {
        handleClose();
        clearUserData();
        navigate("/auth/login", { replace: true });
    };

    return (
        <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            PaperProps={{
                sx: {
                    width: 350,
                    p: 2,
                    borderRadius: "12px",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
                    border: "1px solid rgba(0,0,0,0.08)",
                    mt: 1,
                },
            }}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        >
            <Box sx={{ p: 2, bgcolor: "#FF1572", color: "white" }}>
                <Box display="flex" flexDirection="column" alignItems="center" gap={3}>
                    <Avatar
                        src={avatarSrc || undefined}
                        sx={{
                            width: 56,
                            height: 56,
                            bgcolor: "rgba(255,255,255,0.2)",
                            fontSize: 20,
                            fontWeight: 700,
                            border: "3px solid rgba(255,255,255,0.3)",
                        }}
                    >
                        {!avatarSrc ? avatarInitials : null}
                    </Avatar>
                    <Box sx={{ textAlign: "center" }}>
                        <Typography fontSize={18} fontWeight={700}>
                            {displayName}
                        </Typography>
                        <Typography fontSize={14} opacity={0.9}>
                            {displayEmail}
                        </Typography>
                    </Box>
                </Box>
            </Box>

            <Divider sx={{ borderColor: "rgba(0,0,0,0.08)" }} />

            <Box sx={{ py: 1 }}>
                <MenuItem
                    onClick={handleSettings}
                    sx={{
                        px: 3,
                        py: 2,
                        gap: 2,
                        "&:hover": {
                            bgcolor: "rgba(255, 21, 114, 0.08)",
                        },
                    }}
                >
                    <SettingsIcon sx={{ color: "#5E1321", fontSize: 20 }} />
                    <Box>
                        <Typography fontSize={15} fontWeight={500} color="#333">
                            Settings
                        </Typography>
                        <Typography fontSize={12} color="#666">
                            Privacy and security
                        </Typography>
                    </Box>
                </MenuItem>

                <MenuItem
                    onClick={handleLogout}
                    sx={{
                        px: 3,
                        py: 2,
                        gap: 2,
                        "&:hover": {
                            bgcolor: "rgba(255, 21, 114, 0.08)",
                        },
                    }}
                >
                    <LogoutIcon sx={{ color: "#5E1321", fontSize: 20 }} />
                    <Box>
                        <Typography fontSize={15} fontWeight={500} color="#333">
                            Logout
                        </Typography>
                        <Typography fontSize={12} color="#666">
                            Sign out of your account
                        </Typography>
                    </Box>
                </MenuItem>
            </Box>
        </Menu>
    );
};

export default ProfilePopup;
