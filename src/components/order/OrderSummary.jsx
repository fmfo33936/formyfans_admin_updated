import { Box, Typography, Grid, Divider } from "@mui/material";

const labelSx = { fontSize: { xs: 12, sm: 13 }, color: "#666", fontWeight: 500, mb: 0.5 };
const valueSx = { fontSize: { xs: 14, sm: 15 }, fontWeight: 600, color: "#333" };

const cardContent = (data) => (
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
            width: "100%",
        }}
    >
        <Typography fontSize={18} fontWeight={700} color="#5E1321" mb={2}>
            Order Summary
        </Typography>

        <Grid container spacing={{ xs: 2, sm: 2.5 }} sx={{ flex: 1, width: "100%" }}>
            <Grid size={{ xs: 6 }}>
                <Typography sx={labelSx}>Subtotal</Typography>
                <Typography sx={valueSx}>{data?.subtotal ?? "—"}</Typography>
            </Grid>
            <Grid size={{ xs: 6 }}>
                <Typography sx={labelSx}>Discount</Typography>
                <Typography sx={{ ...valueSx, color: "#FF1572" }}>
                    {data?.discount ?? "—"}
                </Typography>
            </Grid>
            <Grid size={{ xs: 6 }}>
                <Typography sx={labelSx}>Shipping</Typography>
                <Typography sx={valueSx}>{data?.shipping ?? "—"}</Typography>
            </Grid>
            <Grid size={{ xs: 6 }}>
                <Typography sx={labelSx}>Tax</Typography>
                <Typography sx={valueSx}>{data?.tax ?? "—"}</Typography>
            </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />

        <Box>
            <Typography sx={{ ...labelSx, mb: 0.75, color: "#5E1321", fontWeight: 600 }}>
                Total Amount
            </Typography>
            <Typography fontSize={{ xs: 22, sm: 24 }} fontWeight={700} color="#FF1572">
                {data?.totalAmount ?? "—"}
            </Typography>
        </Box>
    </Box>
);

/**
 * @param {object} [gridItemSize] — MUI Grid v7 `size` (e.g. `{ xs: 12, md: 6 }` = half row on md+). Omit to render only the card.
 * @param {object} [gridItemSx] — optional `sx` on the grid cell.
 */
const OrderSummary = ({ data, gridItemSize, gridItemSx }) => {
    if (gridItemSize != null) {
        return (
            <Grid size={gridItemSize} sx={{ minWidth: 0, maxWidth: "100%", ...gridItemSx }}>
                {cardContent(data)}
            </Grid>
        );
    }
    return cardContent(data);
};

export default OrderSummary;
