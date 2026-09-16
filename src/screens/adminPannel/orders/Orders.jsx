import { Box, Typography, IconButton, TableCell } from "@mui/material";
import { useState, useCallback, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import VisibilityIcon from "@mui/icons-material/Visibility";
import Header from "../../../components/header";
import PaginatedTable from "../../../components/dynamicTable";
import Sidebar from "../../../components/sidebar";
import { adminMenuItems } from "../../../constants/adminMenuItems";
import useOrders from "../../../hook/orders";
import OrderStatusChip from "../../../components/order/OrderStatusChip";
import { mapOrderToTableRow } from "../../../utils/orderHelpers";

const ORDER_DETAIL_PATH = "/app/order-detail";

const Orders = () => {
    const navigate = useNavigate();
    const [collapsed, setCollapsed] = useState(false);
    const { orders, pagination, loading, fetchOrders } = useOrders();

    useEffect(() => {
        fetchOrders({ page: 1, limit: 10 });
    }, [fetchOrders]);

    const handleToggleSidebar = () => {
        setCollapsed(!collapsed);
    };

    const tableHeader = [
        { id: "orderDisplayCode", label: "Order Id", width: "12%", minWidth: 100 },
        { id: "billingName", label: "Billing Name", width: "14%", minWidth: 100 },
        { id: "orderStatus", label: "Status", align: "center", width: "14%", minWidth: 118 },
        { id: "totalAmount", label: "Total Pricing", width: "14%", minWidth: 100 },
        { id: "orderDate", label: "Date", width: "12%", minWidth: 90 },
        { id: "quantity", label: "Qty", align: "center", width: "8%", minWidth: 52 },
        { id: "viewDetails", label: "View Details", align: "center", width: "12%", minWidth: 90 },
    ];

    const displayRows = [
        "orderDisplayCode",
        "billingName",
        "orderStatus",
        "totalAmount",
        "orderDate",
        "quantity",
        "viewDetails",
    ];

    const tableData = useMemo(
        () => orders.map((order, index) => mapOrderToTableRow(order, index)),
        [orders],
    );

    const pageLimit = pagination.limit || 10;
    const currentPage = pagination.page ?? 1;
    const tablePage = Math.max(0, currentPage - 1);

    const customRenderCell = useCallback(
        (row, columnKey) => {
            if (columnKey === "orderStatus") {
                return (
                    <TableCell key={columnKey} align="center" sx={{ verticalAlign: "middle" }}>
                        <OrderStatusChip status={row.status} />
                    </TableCell>
                );
            }

            if (columnKey === "quantity") {
                return (
                    <TableCell key={columnKey} align="center" sx={{ verticalAlign: "middle" }}>
                        <Typography fontSize={16} fontWeight={600} sx={{ color: "#5E1321" }}>
                            {row.quantity ?? "—"}
                        </Typography>
                    </TableCell>
                );
            }

            if (columnKey !== "viewDetails") return null;

            return (
                <TableCell key={columnKey} align="center" sx={{ verticalAlign: "middle" }}>
                    <IconButton
                        aria-label="View order details"
                        onClick={() => {
                            if (!row.orderApiId) {
                                toast.error("Order id not found for this order");
                                return;
                            }
                            const query = new URLSearchParams({
                                orderId: row.orderApiId,
                                orderRecordId: row.orderRecordId ?? "",
                            });
                            navigate(`${ORDER_DETAIL_PATH}?${query.toString()}`);
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
        },
        [navigate],
    );

    return (
        <Box sx={{ overflowX: "hidden", maxWidth: "100%" }}>
            <Header sidebarCollapsed={collapsed} />
            <Sidebar
                menuItems={adminMenuItems}
                activeItem="Orders"
                collapsed={collapsed}
                onToggle={handleToggleSidebar}
            />
            <Box
                sx={{
                    marginLeft: { xs: 0, sm: 0, md: collapsed ? "80px" : "250px" },
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
                <Typography fontSize={{ xs: 24, md: 28 }} fontWeight={700} color="#333333" mb={4}>
                    List of Orders
                </Typography>

                <Box sx={{ width: "100%", minWidth: 0, maxWidth: "100%", overflowX: "auto" }}>
                    <PaginatedTable
                        tableHeader={tableHeader}
                        tableData={tableData}
                        displayRows={displayRows}
                        headerBgColor="#5E1321"
                        isLoading={loading}
                        serverSidePagination
                        totalCount={pagination.totalOrders ?? 0}
                        page={tablePage}
                        rowsPerPage={pageLimit}
                        onPageChange={(_event, newPage) => {
                            fetchOrders({ page: newPage + 1, limit: pageLimit });
                        }}
                        onRowsPerPageChange={(_event, newLimit) => {
                            fetchOrders({ page: 1, limit: newLimit });
                        }}
                        customRenderCell={customRenderCell}
                        tableWidth="100%"
                    />
                </Box>
            </Box>
        </Box>
    );
};

export default Orders;
