import { Box, Typography, Grid } from "@mui/material";

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
            Shipping Information
        </Typography>
        <Grid container spacing={{ xs: 2, sm: 2.5 }} sx={{ width: "100%" }}>
            <Grid size={12}>
                <Typography sx={labelSx}>Full Name</Typography>
                <Typography sx={valueSx}>{data?.name || "N/A"}</Typography>
            </Grid>
            <Grid size={12}>
                <Typography sx={labelSx}>Phone</Typography>
                <Typography sx={valueSx}>{data?.phone || "N/A"}</Typography>
            </Grid>
            <Grid size={12}>
                <Typography sx={labelSx}>City</Typography>
                <Typography sx={valueSx}>{data?.city || "N/A"}</Typography>
            </Grid>
            <Grid size={12}>
                <Typography sx={labelSx}>Address</Typography>
                <Typography sx={valueSx}>{data?.address || "N/A"}</Typography>
            </Grid>
            <Grid size={12}>
                <Typography sx={labelSx}>Postal Code</Typography>
                <Typography sx={valueSx}>{data?.postalCode || "N/A"}</Typography>
            </Grid>
        </Grid>
    </Box>
);

/**
 * @param {object} [gridItemSize] — MUI Grid v7 `size` (e.g. `{ xs: 12, md: 6 }`).
 * @param {object} [gridItemSx] — optional `sx` on the grid cell.
 */
const ShippingInfo = ({ data, gridItemSize, gridItemSx }) => {
    if (gridItemSize != null) {
        return (
            <Grid size={gridItemSize} sx={{ minWidth: 0, maxWidth: "100%", ...gridItemSx }}>
                {cardContent(data)}
            </Grid>
        );
    }
    return cardContent(data);
};

export default ShippingInfo;
