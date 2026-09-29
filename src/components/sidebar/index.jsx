import { Box, Typography, IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ForMyFansLogo from "../../assets/images/home-page-logo.png";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import SubscriptionsIcon from "@mui/icons-material/Subscriptions";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import SettingsIcon from "@mui/icons-material/Settings";
import FlagIcon from "@mui/icons-material/Flag";
import CategoryIcon from "@mui/icons-material/Category";
import HandshakeIcon from "@mui/icons-material/Handshake";
import CampaignIcon from "@mui/icons-material/Campaign";
import PaidIcon from "@mui/icons-material/Paid";

const Sidebar = ({ menuItems, activeItem, collapsed = false, onToggle }) => {
    const navigate = useNavigate();

    const handleClick = (item) => {
        if (item.path) {
            navigate(item.path);
        }
    };

    const getIcon = (label) => {
        switch (label.toLowerCase()) {
            case "dashboard":
                return <DashboardIcon sx={{ fontSize: 18 }} />;
            case "users":
                return <PeopleIcon sx={{ fontSize: 18 }} />;
            case "orders":
                return <ShoppingCartIcon sx={{ fontSize: 18 }} />;
            case "creators":
                return <PersonAddIcon sx={{ fontSize: 18 }} />;
            case "subscription":
                return <SubscriptionsIcon sx={{ fontSize: 18 }} />;
            case "credit pricing":
            case "credits":
            case "credit":
                return <PaidIcon sx={{ fontSize: 18 }} />;
            case "deals":
                return <HandshakeIcon sx={{ fontSize: 18 }} />;
            case "campaigns":
                return <CampaignIcon sx={{ fontSize: 18 }} />;
            case "campaign objective":
                return <FlagIcon sx={{ fontSize: 18 }} />;
            case "campaign category":
                return <CategoryIcon sx={{ fontSize: 18 }} />;
            case "add product":
                return <Inventory2Icon sx={{ fontSize: 18 }} />;
            case "settings":
                return <SettingsIcon sx={{ fontSize: 18 }} />;
            default:
                return <DashboardIcon sx={{ fontSize: 18 }} />;
        }
    };

    return (
        <>
            <Box
                sx={{
                    width: collapsed ? 80 : 250,
                    bgcolor: "#FF1572",
                    height: "100vh",
                    p: collapsed ? 1.5 : 1.5,
                    display: { xs: "none", sm: "none", md: "flex" },
                    flexDirection: "column",
                    transition: "width 0.3s ease",
                    overflow: "hidden",
                    position: "fixed",
                    left: 0,
                    top: 0,
                    zIndex: 1000,
                }}
            >
                <Box sx={{ display: "flex", justifyContent: "flex-end", flexShrink: 0 }}>
                    <IconButton
                        onClick={onToggle}
                        size="small"
                        sx={{ color: "white", "&:hover": { bgcolor: "rgba(255,255,255,0.1)" } }}
                    >
                        {collapsed ? <MenuIcon fontSize="small" /> : <ChevronLeftIcon fontSize="small" />}
                    </IconButton>
                </Box>

                {collapsed ? (
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: 1.5,
                            mt: 1,
                            overflowY: "auto",
                            flex: 1,
                            pb: 2,
                        }}
                    >
                        <Box
                            component="img"
                            src={ForMyFansLogo}
                            sx={{
                                width: 42,
                                height: 42,
                                mb: 1,
                            }}
                        />
                        {menuItems.map((item, index) => {
                            const isActive = item.label === activeItem;
                            return (
                                <Box
                                    key={index}
                                    sx={{
                                        width: 42,
                                        height: 42,
                                        borderRadius: "10px",
                                        bgcolor: isActive ? "rgba(255,255,255,0.25)" : "transparent",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        cursor: "pointer",
                                        transition: "all 0.2s ease",
                                        flexShrink: 0,
                                        "&:hover": {
                                            bgcolor: isActive
                                                ? "rgba(255,255,255,0.3)"
                                                : "rgba(255,255,255,0.1)",
                                        },
                                    }}
                                    onClick={() => handleClick(item)}
                                >
                                    <Box
                                        sx={{
                                            color: isActive ? "#5E1321" : "white",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                        }}
                                    >
                                        {getIcon(item.label)}
                                    </Box>
                                </Box>
                            );
                        })}
                    </Box>
                ) : (
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            mt: 0.5,
                            overflowY: "auto",
                            flex: 1,
                            pb: 2,
                            gap: 0.5,
                        }}
                    >
                        <Box
                            component="img"
                            src={ForMyFansLogo}
                            sx={{
                                width: 64,
                                height: 64,
                                mb: 1.5,
                                alignSelf: "center",
                                flexShrink: 0,
                            }}
                        />

                        {menuItems.map((item, index) => {
                            const isActive = item.label === activeItem;
                            return (
                                <Box
                                    key={index}
                                    onClick={() => handleClick(item)}
                                    sx={{
                                        cursor: item.path ? "pointer" : "default",
                                        px: 1.5,
                                        py: 0.85,
                                        borderRadius: "8px",
                                        bgcolor: isActive ? "rgba(255,255,255,0.15)" : "transparent",
                                        transition: "all 0.2s ease",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 1.25,
                                        flexShrink: 0,
                                        "&:hover": item.path
                                            ? {
                                                  bgcolor: isActive
                                                      ? "rgba(255,255,255,0.2)"
                                                      : "rgba(255,255,255,0.08)",
                                                  opacity: 0.9,
                                              }
                                            : {},
                                    }}
                                >
                                    <Box
                                        sx={{
                                            color: isActive ? "#5E1321" : "white",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            flexShrink: 0,
                                        }}
                                    >
                                        {getIcon(item.label)}
                                    </Box>
                                    <Typography
                                        fontSize={14}
                                        fontWeight={600}
                                        lineHeight={1.25}
                                        color={isActive ? "#5E1321" : "white"}
                                        sx={{
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            whiteSpace: "nowrap",
                                        }}
                                    >
                                        {item.label}
                                    </Typography>
                                </Box>
                            );
                        })}
                    </Box>
                )}
            </Box>

            <Box
                sx={{
                    display: { xs: "flex", sm: "flex", md: "none" },
                    bgcolor: "#FF1572",
                    py: 1,
                    px: 1,
                    overflowX: "auto",
                    gap: 1,
                    flexShrink: 0,
                }}
            >
                {menuItems.map((item, index) => {
                    const isActive = item.label === activeItem;
                    return (
                        <Typography
                            key={index}
                            fontSize={13}
                            fontWeight={600}
                            color={isActive ? "#5E1321" : "white"}
                            sx={{
                                cursor: item.path ? "pointer" : "default",
                                whiteSpace: "nowrap",
                                px: 1.5,
                                py: 0.75,
                                borderRadius: "20px",
                                bgcolor: isActive ? "rgba(255,255,255,0.2)" : "transparent",
                                "&:hover": item.path ? { bgcolor: "rgba(255,255,255,0.1)" } : {},
                            }}
                            onClick={() => handleClick(item)}
                        >
                            {item.label}
                        </Typography>
                    );
                })}
            </Box>
        </>
    );
};

export default Sidebar;
