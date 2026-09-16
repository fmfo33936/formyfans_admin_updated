import {
    Avatar,
    Box,
    Chip,
    FormControl,
    IconButton,
    MenuItem,
    Select,
    Tab,
    Tabs,
    TableCell,
    Typography,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Header from "../../../components/header";
import PaginatedTable from "../../../components/dynamicTable";
import Sidebar from "../../../components/sidebar";
import { adminMenuItems } from "../../../constants/adminMenuItems";
import useDeals from "../../../hook/deals";
import {
    DEAL_STATUS_OPTIONS,
    formatPersonName,
    getDealStatusStyle,
    getPaymentStatusStyle,
    mapDealToTableRow,
} from "../../../utils/dealHelpers";

const DEAL_DETAIL_PATH = "/app/deal-detail";

const PersonCell = ({ person }) => (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1, minWidth: 0 }}>
        <Avatar
            src={person?.image || undefined}
            alt={formatPersonName(person)}
            sx={{ width: 32, height: 32, flexShrink: 0 }}
        />
        <Box sx={{ minWidth: 0 }}>
            <Typography
                fontSize={14}
                fontWeight={600}
                color="#5E1321"
                noWrap
                title={formatPersonName(person)}
            >
                {formatPersonName(person)}
            </Typography>
            {person?.username ? (
                <Typography fontSize={12} color="#888" noWrap>
                    @{person.username}
                </Typography>
            ) : null}
        </Box>
    </Box>
);

const StatusChip = ({ status, styleFn }) => {
    if (!status) return "—";
    const label = String(status).replace(/-/g, " ");
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
                ...styleFn(status),
            }}
        />
    );
};

const Deals = () => {
    const navigate = useNavigate();
    const [collapsed, setCollapsed] = useState(false);
    const [activeTab, setActiveTab] = useState(0);
    const [statusFilter, setStatusFilter] = useState("");
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const { deals, pagination, loading, fetchAllDeals } = useDeals();

    useEffect(() => {
        fetchAllDeals({ page: 1, limit: rowsPerPage, status: statusFilter });
    }, [fetchAllDeals, statusFilter, rowsPerPage]);

    const handleToggleSidebar = () => {
        setCollapsed(!collapsed);
    };

    const tableHeader = [
        { id: "title", label: "Title", width: "18%", minWidth: 140 },
        { id: "sender", label: "Sender", width: "18%", minWidth: 150 },
        { id: "receiver", label: "Receiver", width: "18%", minWidth: 150 },
        { id: "amount", label: "Amount", width: "12%", minWidth: 100 },
        { id: "status", label: "Status", align: "center", width: "12%", minWidth: 110 },
        { id: "paymentStatus", label: "Payment Status", align: "center", width: "12%", minWidth: 120 },
        { id: "action", label: "Action", align: "center", width: "10%", minWidth: 80 },
    ];

    const displayRows = [
        "title",
        "sender",
        "receiver",
        "amount",
        "status",
        "paymentStatus",
        "action",
    ];

    const tableData = useMemo(() => deals.map(mapDealToTableRow), [deals]);
    const currentPage = pagination.page ?? 1;
    const tablePage = Math.max(0, currentPage - 1);

    const customRenderCell = useCallback(
        (row, columnKey) => {
            if (columnKey === "sender") {
                return (
                    <TableCell key={columnKey} sx={{ verticalAlign: "middle" }}>
                        <PersonCell person={row.sender} />
                    </TableCell>
                );
            }

            if (columnKey === "receiver") {
                return (
                    <TableCell key={columnKey} sx={{ verticalAlign: "middle" }}>
                        <PersonCell person={row.receiver} />
                    </TableCell>
                );
            }

            if (columnKey === "status") {
                return (
                    <TableCell key={columnKey} align="center" sx={{ verticalAlign: "middle" }}>
                        <StatusChip status={row.status} styleFn={getDealStatusStyle} />
                    </TableCell>
                );
            }

            if (columnKey === "paymentStatus") {
                return (
                    <TableCell key={columnKey} align="center" sx={{ verticalAlign: "middle" }}>
                        <StatusChip status={row.paymentStatus} styleFn={getPaymentStatusStyle} />
                    </TableCell>
                );
            }

            if (columnKey === "action") {
                return (
                    <TableCell key={columnKey} align="center" sx={{ verticalAlign: "middle" }}>
                        <IconButton
                            aria-label="View deal details"
                            onClick={() => {
                                if (!row._id) {
                                    toast.error("Deal id not found");
                                    return;
                                }
                                navigate(`${DEAL_DETAIL_PATH}?dealId=${row._id}`);
                            }}
                            sx={{
                                color: "#5E1321",
                                "&:hover": { backgroundColor: "rgba(94, 19, 33, 0.1)" },
                            }}
                        >
                            <VisibilityIcon />
                        </IconButton>
                    </TableCell>
                );
            }

            return null;
        },
        [navigate],
    );

    return (
        <Box sx={{ overflowX: "hidden", maxWidth: "100%" }}>
            <Header sidebarCollapsed={collapsed} />
            <Sidebar
                menuItems={adminMenuItems}
                activeItem="Deals"
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
                <Typography
                    fontSize={{ xs: 24, md: 28 }}
                    fontWeight={700}
                    color="#333333"
                    mb={2}
                >
                    Deals
                </Typography>

                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 2,
                        flexWrap: "wrap",
                        mb: 3,
                    }}
                >
                    <Tabs
                        value={activeTab}
                        onChange={(_e, value) => setActiveTab(value)}
                        sx={{
                            minHeight: 42,
                            "& .MuiTab-root": {
                                textTransform: "none",
                                fontWeight: 600,
                                minHeight: 42,
                                color: "#666",
                            },
                            "& .Mui-selected": { color: "#5E1321 !important" },
                            "& .MuiTabs-indicator": { backgroundColor: "#5E1321" },
                        }}
                    >
                        <Tab label="All Deals" />
                    </Tabs>

                    <FormControl size="small" sx={{ minWidth: 180 }}>
                        <Select
                            value={statusFilter}
                            displayEmpty
                            onChange={(e) => setStatusFilter(e.target.value)}
                            sx={{
                                bgcolor: "#fff",
                                borderRadius: "10px",
                                textTransform: "capitalize",
                                "& .MuiOutlinedInput-notchedOutline": {
                                    borderColor: "#e0e0e0",
                                },
                            }}
                        >
                            {DEAL_STATUS_OPTIONS.map((option) => (
                                <MenuItem
                                    key={option.value || "all"}
                                    value={option.value}
                                    sx={{ textTransform: "capitalize" }}
                                >
                                    {option.label}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>

                {activeTab === 0 && (
                    <Box sx={{ width: "100%", minWidth: 0, maxWidth: "100%" }}>
                        <PaginatedTable
                            tableHeader={tableHeader}
                            tableData={tableData}
                            displayRows={displayRows}
                            headerBgColor="#5E1321"
                            isLoading={loading}
                            tableWidth="100%"
                            serverSidePagination
                            totalCount={pagination.totalDeals ?? 0}
                            page={tablePage}
                            rowsPerPage={rowsPerPage}
                            rowsPerPageOptions={[5, 10, 25, 50]}
                            onPageChange={(_event, newPage) => {
                                fetchAllDeals({
                                    page: newPage + 1,
                                    limit: rowsPerPage,
                                    status: statusFilter,
                                });
                            }}
                            onRowsPerPageChange={(_event, newLimit) => {
                                setRowsPerPage(newLimit);
                            }}
                            customRenderCell={customRenderCell}
                        />
                    </Box>
                )}
            </Box>
        </Box>
    );
};

export default Deals;
