import { Paper, Typography, Box } from "@mui/material";

const ChartCard = ({ title, children, sx = {} }) => {
    return (
        <Paper
            elevation={0}
            sx={{
                p: { xs: 2, sm: 3 },
                borderRadius: "12px",
                bgcolor: "white",
                height: "100%",
                maxHeight: "100%",
                minHeight: 0,
                width: "100%",
                maxWidth: "100%",
                minWidth: 0,
                flex: 1,
                boxSizing: "border-box",
                boxShadow: "0 1px 4px rgba(0, 0, 0, 0.08)",
                border: "1px solid rgba(0, 0, 0, 0.06)",
                display: "flex",
                flexDirection: "column",
                ...sx,
            }}
        >
            {title && (
                <Typography
                    fontSize={{ xs: 16, sm: 18 }}
                    fontWeight={700}
                    color="rgba(94, 19, 33, 1)"
                    mb={2}
                >
                    {title}
                </Typography>
            )}
            <Box sx={{ flex: 1, minHeight: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {children}
            </Box>
        </Paper>
    );
};

export default ChartCard;
