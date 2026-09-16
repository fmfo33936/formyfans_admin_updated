import { Box, Typography, Grid } from "@mui/material";
import OrderStatusChip from "./OrderStatusChip";

const labelSx = { fontSize: { xs: 12, sm: 13 }, color: "#666", fontWeight: 500, mb: 0.5 };
const valueSx = { fontSize: { xs: 14, sm: 15 }, fontWeight: 600, color: "#333", wordBreak: "break-word" };

const cardContent = (data) => (
    <Box
        sx={{
            p: { xs: 2, sm: 3 },
            bgcolor: "white",
            borderRadius: "12px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            height: "100%",
            minWidth: 0,
            width: "100%",
        }}
    >
        <Typography fontSize={18} fontWeight={700} color="#5E1321" mb={2}>
            Delivery Information
        </Typography>
        <Grid container spacing={{ xs: 2, sm: 2.5 }} sx={{ width: "100%" }}>
            <Grid size={{ xs: 12, sm: 6 }}>
                <Typography sx={labelSx}>Delivery Method</Typography>
                <Typography sx={valueSx}>{data?.method || "Standard Delivery"}</Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
                <Typography sx={labelSx}>Estimated Delivery</Typography>
                <Typography sx={valueSx}>{data?.estimatedDate || "N/A"}</Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
                <Typography sx={labelSx}>Tracking Number</Typography>
                <Typography sx={valueSx}>{data?.trackingNumber || "N/A"}</Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
                <Typography sx={labelSx}>Status</Typography>
                {data?.statusRaw ? (
                    <OrderStatusChip status={data.statusRaw} />
                ) : (
                    <Typography sx={{ ...valueSx, color: "#FF1572" }}>
                        {data?.status || "—"}
                    </Typography>
                )}
            </Grid>
        </Grid>
    </Box>
);

/**
 * @param {object} [gridItemSize] — MUI Grid v7 `size` (e.g. `{ xs: 12, md: 6 }`).
 * @param {object} [gridItemSx] — optional `sx` on the grid cell.
 */
const DeliveryInfo = ({ data, gridItemSize, gridItemSx }) => {
    if (gridItemSize != null) {
        return (
            <Grid size={gridItemSize} sx={{ minWidth: 0, maxWidth: "100%", ...gridItemSx }}>
                {cardContent(data)}
            </Grid>
        );
    }
    return cardContent(data);
};

export default DeliveryInfo;
