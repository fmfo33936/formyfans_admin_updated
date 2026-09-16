import { Box } from "@mui/material";
import PaginatedTable from "../dynamicTable";

/**
 * Single-row order metadata table (maroon header), full width, no pagination.
 */
const OrderInfoTable = ({ data }) => {
    const row = {
        id: "order-info",
        orderId: data?.orderId ?? "—",
        billingName: data?.billingName ?? "—",
        date: data?.date ?? "—",
        trackingId: data?.trackingId ?? "—",
    };

    const tableHeader = [
        { id: "orderId", label: "Order ID", minWidth: 110 },
        { id: "billingName", label: "Billing Name", minWidth: 130 },
        { id: "date", label: "Date", minWidth: 100 },
        { id: "trackingId", label: "Tracking ID", minWidth: 130 },
    ];

    const displayRows = ["orderId", "billingName", "date", "trackingId"];

    return (
        <Box
            sx={{
                bgcolor: "white",
                borderRadius: "12px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                overflow: "hidden",
                p: { xs: 1.5, sm: 2, md: 2.5 },
            }}
        >
            <PaginatedTable
                tableHeader={tableHeader}
                tableData={[row]}
                displayRows={displayRows}
                showPagination={false}
                headerBgColor="#5E1321"
                tableWidth="100%"
            />
        </Box>
    );
};

export default OrderInfoTable;
