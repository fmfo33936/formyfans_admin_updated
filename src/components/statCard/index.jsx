import { Paper, Typography, Box } from "@mui/material";

const StatCard = ({ title, value, icon, color, trend, onClick }) => {
    return (
        <Paper
            elevation={0}
            onClick={onClick}
            sx={{
                p: { xs: 2, sm: 2.5, md: 3, lg: 3 },
                borderRadius: 12,
                background: color,
                color: "white",
                width: "100%",
                maxWidth: "100%",
                minWidth: 0,
                boxSizing: "border-box",
                height: { xs: 100, sm: 120, md: 160, lg: 180, xl: 200 },
                cursor: onClick ? "pointer" : "default",
                transition: "all 0.3s ease",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                "&:hover": onClick ? {
                    transform: "translateY(-4px)",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
                } : {},
            }}
        >
            <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                <Typography fontSize={{ xs: 12, sm: 14, md: 15, lg: 16 }} fontWeight={500} opacity={0.9}>
                    {title}
                </Typography>
                {icon}
            </Box>
            <Box>
                <Typography fontSize={{ xs: 20, sm: 24, md: 26, lg: 28 }} fontWeight={700}>
                    {value}
                </Typography>
                {trend && (
                    <Typography fontSize={{ xs: 10, sm: 11, md: 12, lg: 13 }} fontWeight={500} opacity={0.8} mt={0.5}>
                        {trend}
                    </Typography>
                )}
            </Box>
        </Paper>
    );
};

export default StatCard;
