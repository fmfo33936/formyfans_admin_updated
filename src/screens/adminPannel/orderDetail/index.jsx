import { Typography, Box, Grid, CircularProgress } from "@mui/material";
import { useState, useEffect, useMemo } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate, useSearchParams } from "react-router-dom";
import Header from "../../../components/header";
import Sidebar from "../../../components/sidebar";
import CustomButton from "../../../components/customButton";
import ShippingInfo from "../../../components/order/ShippingInfo";
import DeliveryInfo from "../../../components/order/DeliveryInfo";
import OrderItemsTable from "../../../components/order/OrderItemsTable";
import OrderSummary from "../../../components/order/OrderSummary";
import OrderInfoTable from "../../../components/order/OrderInfoTable";
import { adminMenuItems } from "../../../constants/adminMenuItems";
import useOrders from "../../../hook/orders";
import OrderStatusChip from "../../../components/order/OrderStatusChip";
import {
    formatOrderDate,
    formatOrderStatusDisplay,
    getOrderBillingName,
    getOrderDisplayCode,
    getFirstProductId,
    getOrderItems,
    getOrderStatusLabel,
    getOrderSummaryData,
    mapOrderItemToRow,
} from "../../../utils/orderHelpers";

const OrderDetail = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const orderId = searchParams.get("orderId") ?? "";
    const orderRecordId = searchParams.get("orderRecordId") ?? "";

    const [collapsed, setCollapsed] = useState(false);
    const { orderDetail, detailLoading, fetchOrderByOrderId } = useOrders();

    useEffect(() => {
        if (orderId) {
            fetchOrderByOrderId(orderId);
        }
    }, [orderId, fetchOrderByOrderId]);

    const handleToggleSidebar = () => {
        setCollapsed(!collapsed);
    };

    const order = orderDetail;

    const orderInfoData = useMemo(
        () => ({
            orderId: order ? getOrderDisplayCode(order) : "—",
            billingName: order ? getOrderBillingName(order) : "—",
            date: formatOrderDate(order?.createdAt),
            trackingId: order ? getFirstProductId(order) : "—",
        }),
        [order],
    );

    const orderItems = useMemo(
        () => getOrderItems(order).map(mapOrderItemToRow),
        [order],
    );

    const shippingInfo = useMemo(
        () => ({
            name: order?.delivery?.name ?? "—",
            address: order?.delivery?.deliveryAddress ?? "—",
            phone: order?.delivery?.phoneNumber ?? "—",
            city: order?.delivery?.city ?? "—",
            postalCode: order?.delivery?.zipCode ?? "—",
        }),
        [order],
    );

    const orderStatusLabel = order ? getOrderStatusLabel(order) : "";

    const deliveryInfo = useMemo(
        () => ({
            method: order?.paymentMethod?.replace(/_/g, " ") ?? "—",
            estimatedDate: formatOrderDate(order?.updatedAt),
            trackingNumber: order ? getFirstProductId(order) : "—",
            status: formatOrderStatusDisplay(orderStatusLabel),
            statusRaw: orderStatusLabel,
        }),
        [order, orderStatusLabel],
    );

    const orderSummary = useMemo(() => getOrderSummaryData(order), [order]);

    const contentSx = {
        marginLeft: { xs: 0, sm: 0, md: collapsed ? "80px" : "250px" },
        backgroundColor: "#f5f5f5",
        padding: { xs: "16px", sm: "20px", md: "24px" },
        paddingTop: "32px",
        transition: "margin-left 0.3s ease",
        maxWidth: { xs: "100%", md: "min(1600px, 100%)" },
        width: { xs: "100%", md: "auto" },
        minWidth: 0,
        minHeight: "calc(100vh - 80px)",
        boxSizing: "border-box",
        overflowX: "hidden",
    };

    const gridStretch = { display: "flex", flexDirection: "column", minWidth: 0 };
    const gridRowContainerSx = { width: "100%", minWidth: 0 };
    const gridOrderSummary = { xs: 12, md: 6 };
    const gridDelivery = { xs: 12, md: 6 };
    const gridShipping = { xs: 12, md: 6 };

    return (
        <Box sx={{ overflowX: "hidden", maxWidth: "100%" }}>
            <Header sidebarCollapsed={collapsed} />
            <Sidebar
                menuItems={adminMenuItems}
                activeItem="Orders"
                collapsed={collapsed}
                onToggle={handleToggleSidebar}
            />
            <Box sx={contentSx}>
                <Typography fontSize={{ xs: 24, md: 28 }} fontWeight={700} color="#333333" mb={3}>
                    Order Details
                </Typography>

                <Box mb={4}>
                    <CustomButton
                        startIcon={<ArrowBackIcon />}
                        handlePressBtn={() => navigate("/app/orders")}
                        btnLabel="Back to Orders"
                        btnTextTransform="none"
                        textWeight={700}
                        btnTextSize={{ xs: "14px", sm: "16px" }}
                        btnTextColor="#5E1321"
                        btnBgColor="transparent"
                        btnHoverColor="rgba(94, 19, 33, 0.1)"
                        sx={{ mb: 2 }}
                    />

                    {detailLoading ? (
                        <Box display="flex" justifyContent="center" py={6}>
                            <CircularProgress sx={{ color: "#FF1572" }} />
                        </Box>
                    ) : !order ? (
                        <Typography color="text.secondary">
                            {orderId
                                ? "Order details not found."
                                : "Missing order id in URL."}
                        </Typography>
                    ) : (
                        <>
                            <OrderInfoTable data={orderInfoData} />

                            {orderStatusLabel ? (
                                <Box sx={{ mt: 2, display: "flex", alignItems: "center", gap: 1 }}>
                                    <Typography fontSize={14} fontWeight={600} color="#666">
                                        Order Status:
                                    </Typography>
                                    <OrderStatusChip status={orderStatusLabel} />
                                </Box>
                            ) : null}

                            <Box sx={{ ...gridStretch, mb: 3, mt: 3 }}>
                                <OrderItemsTable
                                    items={orderItems}
                                    subtotal={
                                        order?.subtotal ?? order?.orderDetails?.subtotal
                                    }
                                    totalAmount={
                                        order?.totalAmount ?? order?.orderDetails?.totalAmount
                                    }
                                    defaultRowsPerPage={5}
                                />
                            </Box>

                            <Grid
                                container
                                spacing={{ xs: 2, sm: 3, md: 3 }}
                                alignItems="stretch"
                                mb={{ xs: 2, md: 3 }}
                                sx={gridRowContainerSx}
                            >
                                <OrderSummary
                                    data={orderSummary}
                                    gridItemSize={gridOrderSummary}
                                    gridItemSx={gridStretch}
                                />
                                <DeliveryInfo
                                    data={deliveryInfo}
                                    gridItemSize={gridDelivery}
                                    gridItemSx={gridStretch}
                                />
                            </Grid>

                            <Grid
                                container
                                spacing={{ xs: 2, sm: 3, md: 3 }}
                                alignItems="stretch"
                                sx={gridRowContainerSx}
                            >
                                <ShippingInfo
                                    data={shippingInfo}
                                    gridItemSize={gridShipping}
                                    gridItemSx={gridStretch}
                                />
                            </Grid>
                        </>
                    )}
                </Box>
            </Box>
        </Box>
    );
};

export default OrderDetail;
