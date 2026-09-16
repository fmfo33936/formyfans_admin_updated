import { Box, Typography, TableCell } from "@mui/material";
import { useMemo, useCallback } from "react";
import PaginatedTable from "../dynamicTable";
import { formatOrderPrice } from "../../utils/orderHelpers";

const CELL = "#5E1321";

const OrderItemsTable = ({
    items = [],
    subtotal,
    totalAmount,
    defaultRowsPerPage = 5,
    showPagination = true,
}) => {
    const subtotalDisplay = formatOrderPrice(subtotal);
    const totalAmountDisplay = formatOrderPrice(totalAmount);

    const tableData = useMemo(
        () =>
            (Array.isArray(items) ? items : []).map((item) => {
                const qty = Number(item.quantity) || 0;
                return {
                    id: item.id ?? `${item.name}-${qty}`,
                    name: item.name ?? "—",
                    quantity: qty,
                    priceDisplay: subtotalDisplay,
                    lineTotalDisplay: totalAmountDisplay,
                };
            }),
        [items, subtotalDisplay, totalAmountDisplay],
    );

    const tableHeader = [
        { id: "name", label: "Product", minWidth: 120 },
        { id: "quantity", label: "Quantity", align: "center", minWidth: 96 },
        { id: "priceDisplay", label: "Subtotal", align: "right", minWidth: 100 },
        { id: "lineTotalDisplay", label: "Total Amount", align: "right", minWidth: 110 },
    ];

    const displayRows = ["name", "quantity", "priceDisplay", "lineTotalDisplay"];

    const customRenderCell = useCallback((row, val) => {
        if (val === "quantity") {
            return (
                <TableCell key={val} align="center" sx={{ verticalAlign: "middle" }}>
                    <Typography fontSize={16} fontWeight={600} sx={{ color: CELL }}>
                        {row.quantity}
                    </Typography>
                </TableCell>
            );
        }
        if (val === "priceDisplay" || val === "lineTotalDisplay") {
            return (
                <TableCell key={val} align="right" sx={{ verticalAlign: "middle" }}>
                    <Typography fontSize={16} fontWeight={600} sx={{ color: CELL }}>
                        {row[val]}
                    </Typography>
                </TableCell>
            );
        }
        return null;
    }, []);

    return (
        <Box
            sx={{
                p: { xs: 2, sm: 3 },
                bgcolor: "white",
                borderRadius: "12px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                minWidth: 0,
                minHeight: 0,
            }}
        >
            <Typography fontSize={18} fontWeight={700} color="#5E1321" mb={2}>
                Order Items
            </Typography>
            <Box sx={{ flex: 1, minHeight: 0, width: "100%", overflowX: "auto" }}>
                <PaginatedTable
                    tableHeader={tableHeader}
                    tableData={tableData}
                    displayRows={displayRows}
                    showPagination={showPagination}
                    customRenderCell={customRenderCell}
                    headerBgColor="#5E1321"
                    tableWidth="100%"
                    initialRowsPerPage={defaultRowsPerPage}
                    getRowId={(r) => String(r.id)}
                />
            </Box>
        </Box>
    );
};

export default OrderItemsTable;
