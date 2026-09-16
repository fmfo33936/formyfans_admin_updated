import SearchIcon from "@mui/icons-material/Search";
import { Box, Chip, InputAdornment, TableCell, TextField, Typography } from "@mui/material";
import { useCallback, useEffect, useMemo, useState } from "react";
import Header from "../../../components/header";
import PaginatedTable from "../../../components/dynamicTable";
import Sidebar from "../../../components/sidebar";
import { adminMenuItems } from "../../../constants/adminMenuItems";
import useCampaigns from "../../../hook/campaigns";
import {
    getCampaignStatusStyle,
    mapCampaignToTableRow,
} from "../../../utils/campaignHelpers";

const StatusChip = ({ status }) => {
    if (!status || status === "—") return "—";
    const label = String(status).replace(/_/g, " ");
    return (
        <Chip
            label={label}
            size="small"
            sx={{
                height: 28,
                fontSize: 12,
                fontWeight: 600,
                textTransform: "capitalize",
                border: "none",
                "& .MuiChip-label": { px: 1.5 },
                ...getCampaignStatusStyle(status),
            }}
        />
    );
};

const Campaigns = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [searchInput, setSearchInput] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const { campaigns, pagination, loading, fetchAllCampaigns } = useCampaigns();

    useEffect(() => {
        const timer = setTimeout(() => {
            setSearchQuery(searchInput.trim());
        }, 400);
        return () => clearTimeout(timer);
    }, [searchInput]);

    useEffect(() => {
        fetchAllCampaigns({
            page: 1,
            limit: rowsPerPage,
            search: searchQuery,
        });
    }, [fetchAllCampaigns, rowsPerPage, searchQuery]);

    const handleToggleSidebar = () => {
        setCollapsed(!collapsed);
    };

    const tableHeader = [
        { id: "name", label: "Name", width: "14%", minWidth: 130 },
        { id: "brand", label: "Brand", width: "10%", minWidth: 100 },
        { id: "budget", label: "Budget", width: "10%", minWidth: 100 },
        { id: "status", label: "Status", align: "center", width: "10%", minWidth: 100 },
        { id: "launchType", label: "Launch Type", width: "12%", minWidth: 90 },
        { id: "startDate", label: "Start", width: "9%", minWidth: 90 },
        { id: "endDate", label: "End", width: "9%", minWidth: 90 },
        { id: "createdAt", label: "Created", width: "9%", minWidth: 90 },
    ];

    const displayRows = [
        "name",
        "brand",
        "budget",
        "status",
        "launchType",
        "startDate",
        "endDate",
        "createdAt",
    ];

    const tableData = useMemo(() => campaigns.map(mapCampaignToTableRow), [campaigns]);
    const currentPage = pagination.page ?? 1;
    const tablePage = Math.max(0, currentPage - 1);

    const customRenderCell = useCallback((row, columnKey) => {
        if (columnKey === "status") {
            return (
                <TableCell key={columnKey} align="center" sx={{ verticalAlign: "middle" }}>
                    <StatusChip status={row.status} />
                </TableCell>
            );
        }

        if (columnKey === "launchType") {
            return (
                <TableCell key={columnKey} sx={{ verticalAlign: "middle" }}>
                    <Typography
                        fontSize={14}
                        fontWeight={600}
                        color="#5E1321"
                        sx={{ textTransform: "capitalize" }}
                    >
                        {row.launchType}
                    </Typography>
                </TableCell>
            );
        }

        return null;
    }, []);

    return (
        <Box sx={{ overflowX: "hidden", maxWidth: "100%" }}>
            <Header sidebarCollapsed={collapsed} />
            <Sidebar
                menuItems={adminMenuItems}
                activeItem="Campaigns"
                collapsed={collapsed}
                onToggle={handleToggleSidebar}
            />
            <Box
                sx={{
                    marginLeft: { xs: 0, sm: 0, md: collapsed ? "80px" : "250px" },
                    marginTop: "5px",
                    minHeight: "calc(100vh - 80px)",
                    backgroundColor: "#f5f5f5",
                    padding: { xs: "16px", sm: "20px", md: "24px" },
                    paddingTop: "32px",
                    transition: "margin-left 0.3s ease",
                    maxWidth: { xs: "100%", md: "min(1600px, 100%)" },
                    width: { xs: "100%", md: "auto" },
                    minWidth: 0,
                    overflowX: "hidden",
                    boxSizing: "border-box",
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        alignItems: { xs: "stretch", sm: "flex-start" },
                        justifyContent: "space-between",
                        gap: 2,
                        flexWrap: "wrap",
                        mb: 3,
                    }}
                >
                    <Box sx={{ minWidth: 0, flex: 1 }}>
                        <Typography
                            fontSize={{ xs: 24, md: 28 }}
                            fontWeight={700}
                            color="#333333"
                        >
                            All Campaigns
                        </Typography>
                        <Typography fontSize={14} color="#777" mt={0.75}>
                            View and manage all campaigns. Search by campaign name or brand.
                        </Typography>
                    </Box>

                    <TextField
                        size="small"
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        placeholder="Search by name or brand"
                        sx={{
                            width: { xs: "100%", sm: 280 },
                            bgcolor: "#fff",
                            borderRadius: "10px",
                            "& .MuiOutlinedInput-root": {
                                borderRadius: "10px",
                                "& fieldset": { borderColor: "#e0e0e0" },
                            },
                        }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon sx={{ color: "#888", fontSize: 20 }} />
                                </InputAdornment>
                            ),
                        }}
                    />
                </Box>

                <Box sx={{ width: "100%", minWidth: 0, maxWidth: "100%" }}>
                    <PaginatedTable
                        tableHeader={tableHeader}
                        tableData={tableData}
                        displayRows={displayRows}
                        headerBgColor="#5E1321"
                        isLoading={loading}
                        tableWidth="100%"
                        serverSidePagination
                        totalCount={pagination.totalCampaigns ?? 0}
                        page={tablePage}
                        rowsPerPage={rowsPerPage}
                        rowsPerPageOptions={[5, 10, 25, 50]}
                        onPageChange={(_event, newPage) => {
                            fetchAllCampaigns({
                                page: newPage + 1,
                                limit: rowsPerPage,
                                search: searchQuery,
                            });
                        }}
                        onRowsPerPageChange={(_event, newLimit) => {
                            setRowsPerPage(newLimit);
                        }}
                        customRenderCell={customRenderCell}
                    />
                </Box>
            </Box>
        </Box>
    );
};

export default Campaigns;
