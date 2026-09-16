import { useState } from "react";
import { Box, Drawer, Typography, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate } from "react-router-dom";
import Header from "../header";
import Sidebar from "../sidebar";


const MobileSidebar = ({ menuItems, activeItem, onClose }) => {
    const navigate = useNavigate();

    const handleClick = (item) => {
        if (item.path) {
            navigate(item.path);
            onClose();
        }
    };

    return (
        <Box sx={{ width: 250, bgcolor: "#FF1572", height: "100%", p: 2 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography fontSize={20} fontWeight={700} color="white">
                    Menu
                </Typography>
                <IconButton onClick={onClose} sx={{ color: "white" }}>
                    <CloseIcon />
                </IconButton>
            </Box>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {menuItems.map((item, index) => {
                    const isActive = item.label === activeItem;
                    return (
                        <Typography
                            key={index}
                            fontSize={18}
                            fontWeight={600}
                            color={isActive ? "#5E1321" : "white"}
                            sx={{
                                cursor: item.path ? "pointer" : "default",
                                p: 1,
                                borderRadius: "8px",
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
        </Box>
    );
};

const PageLayout = ({
    children,
    menuItems,
    activeItem,
    sx = {}
}) => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    const toggleDrawer = () => setMobileOpen(!mobileOpen);
    const toggleSidebar = () => setSidebarCollapsed(!sidebarCollapsed);

    return (
        <Box sx={{ height: "100vh", display: "flex", overflow: "hidden" }}>
            <Drawer
                anchor="left"
                open={mobileOpen}
                onClose={() => setMobileOpen(false)}
                sx={{ display: { xs: "block", md: "none" } }}
            >
                <MobileSidebar
                    menuItems={menuItems}
                    activeItem={activeItem}
                    onClose={() => setMobileOpen(false)}
                />
            </Drawer>

            <Box sx={{ 
                display: { xs: "none", md: "flex" },
                flexShrink: 0,
                transition: "width 0.3s ease",
                width: sidebarCollapsed ? 60 : 210,
                position: "relative",
                height: "100vh"
            }}>
                <Sidebar 
                    menuItems={menuItems} 
                    activeItem={activeItem} 
                    collapsed={sidebarCollapsed}
                />
                <IconButton
                    onClick={toggleSidebar}
                    sx={{
                        position: "absolute",
                        right: -15,
                        top: 20,
                        bgcolor: "#FF1572",
                        color: "white",
                        width: 30,
                        height: 30,
                        boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                        "&:hover": {
                            bgcolor: "#E01366"
                        }
                    }}
                >
                    {sidebarCollapsed ? <MenuIcon /> : <CloseIcon />}
                </IconButton>
            </Box>

            <Box sx={{ display: "flex", flexDirection: "column",  flex: 1, overflow: "hidden",  bgcolor: "#F5F5F5"  }}>
                <Header onMenuClick={toggleDrawer} showMenuButton={true} />
                {/* Content */}
                <Box
                    sx={{
                        flex: 1,
                        overflow: "auto",
                        p: { xs: 2, md: 3 },
                        minHeight: 0,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: { xs: "center", md: "stretch" },
                        ...sx,
                    }}
                >
                    {children}
                </Box>
            </Box>
        </Box>
    );
};

export default PageLayout;
