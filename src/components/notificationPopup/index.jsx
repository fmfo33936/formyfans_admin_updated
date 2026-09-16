import { Box, Typography, Divider, Badge, IconButton, Menu } from "@mui/material";
import { useNavigate } from "react-router-dom";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MarkEmailReadIcon from "@mui/icons-material/MarkEmailRead";
import PersonIcon from "@mui/icons-material/Person";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";

const NotificationPopup = ({ anchorEl, onClose }) => {
    const navigate = useNavigate();
    const open = Boolean(anchorEl);

    const handleClose = () => {
        onClose();
    };

    const handleViewAll = () => {
        navigate("/notifications");
        handleClose();
    };

    const handleMarkAllRead = () => {};

    const notifications = [
        {
            id: 1,
            type: "user",
            title: "New User Registration",
            message: "John Doe just joined the platform",
            time: "2 minutes ago",
            read: false,
            icon: <PersonIcon />
        },
        {
            id: 2,
            type: "order",
            title: "New Order Received",
            message: "Order #12345 has been placed",
            time: "15 minutes ago",
            read: false,
            icon: <ShoppingCartIcon />
        },
        {
            id: 3,
            type: "like",
            title: "Your post was liked",
            message: "5 people liked your recent post",
            time: "1 hour ago",
            read: true,
            icon: <ThumbUpIcon />
        },
        {
            id: 4,
            type: "user",
            title: "Profile Update",
            message: "Your profile has been updated successfully",
            time: "3 hours ago",
            read: true,
            icon: <PersonIcon />
        }
    ];

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            PaperProps={{
                sx: {
                    width: 350,
                    maxHeight: 480,
                    p: 0,
                    borderRadius: "12px",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
                    border: "1px solid rgba(0,0,0,0.08)",
                    mt: 1,
                }
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
            <Box sx={{ p: 2, bgcolor: "#FF1572", color: "white" }}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography fontSize={16} fontWeight={700}>
                        Notifications
                    </Typography>
                    <Box display="flex" alignItems="center" gap={1}>
                        {unreadCount > 0 && (
                            <Badge badgeContent={unreadCount} color="error">
                                <NotificationsIcon sx={{ fontSize: 18 }} />
                            </Badge>
                        )}
                        <IconButton
                            size="small"
                            onClick={handleMarkAllRead}
                            sx={{ color: "white", "&:hover": { bgcolor: "rgba(255,255,255,0.1)" } }}
                        >
                            <MarkEmailReadIcon sx={{ fontSize: 18 }} />
                        </IconButton>
                    </Box>
                </Box>
            </Box>

            <Divider sx={{ borderColor: "rgba(0,0,0,0.08)" }} />

            <Box sx={{ maxHeight: 320, overflowY: "auto" }}>
                {notifications.map((notification) => (
                    <Box
                        key={notification.id}
                        sx={{
                            p: 2,
                            bgcolor: notification.read ? "transparent" : "rgba(255, 21, 114, 0.05)",
                            borderBottom: "1px solid rgba(0,0,0,0.06)",
                            "&:hover": {
                                bgcolor: "rgba(255, 21, 114, 0.08)"
                            },
                            cursor: "pointer"
                        }}
                    >
                        <Box display="flex" alignItems="flex-start" gap={2}>
                            <Box
                                sx={{
                                    p: 1,
                                    borderRadius: "8px",
                                    bgcolor: notification.read ? "rgba(0,0,0,0.05)" : "#FF1572",
                                    color: notification.read ? "#666" : "white",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center"
                                }}
                            >
                                {notification.icon}
                            </Box>
                            <Box sx={{ flex: 1, minWidth: 0 }}>
                                <Typography
                                    fontSize={14}
                                    fontWeight={600}
                                    color="#333"
                                    sx={{ mb: 0.5 }}
                                >
                                    {notification.title}
                                </Typography>
                                <Typography
                                    fontSize={12}
                                    color="#666"
                                    sx={{ mb: 0.5 }}
                                >
                                    {notification.message}
                                </Typography>
                                <Typography fontSize={11} color="#999">
                                    {notification.time}
                                </Typography>
                            </Box>
                            {!notification.read && (
                                <Box
                                    sx={{
                                        width: 8,
                                        height: 8,
                                        borderRadius: "50%",
                                        bgcolor: "#FF1572",
                                        mt: 1
                                    }}
                                />
                            )}
                        </Box>
                    </Box>
                ))}
            </Box>

            <Divider sx={{ borderColor: "rgba(0,0,0,0.08)" }} />

            <Box sx={{ p: 2 }}>
                <Typography
                    fontSize={14}
                    fontWeight={600}
                    color="#FF1572"
                    sx={{ cursor: "pointer", textAlign: "center", "&:hover": { opacity: 0.8 } }}
                    onClick={handleViewAll}
                >
                    View all notifications
                </Typography>
            </Box>
        </Menu>
    );
};

export default NotificationPopup;
