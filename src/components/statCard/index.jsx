import { Paper, Typography, Box } from "@mui/material";

const StatCard = ({ title, value, icon, color, trend, onClick }) => {
    return (
        <Paper
            elevation={0}
            onClick={onClick}
            sx={{
                p: { xs: 1.5, sm: 2, md: 2.5 },
                borderRadius: { xs: "10px", sm: "12px" },
                background: color,
                color: "white",
                width: "100%",
                maxWidth: "100%",
                minWidth: 0,
                boxSizing: "border-box",
                minHeight: { xs: 90, sm: 110, md: 130 },
                height: "100%",
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
            <Box display="flex" justifyContent="space-between" alignItems="flex-start" gap={1} minWidth={0}>
                <Typography
                    fontSize={{ xs: 11, sm: 13, md: 14 }}
                    fontWeight={500}
                    opacity={0.9}
                    sx={{ wordBreak: "break-word", overflowWrap: "anywhere", minWidth: 0, flex: 1 }}
                >
                    {title}
                </Typography>
                <Box sx={{ flexShrink: 0, display: "flex" }}>
                    {icon}
                </Box>
            </Box>
            <Box mt={1} minWidth={0}>
                <Typography
                    fontSize={{ xs: 18, sm: 22, md: 24, lg: 26 }}
                    fontWeight={700}
                    sx={{ wordBreak: "break-word", overflowWrap: "anywhere" }}
                >
                    {value}
                </Typography>
                {trend && (
                    <Typography
                        fontSize={{ xs: 9.5, sm: 10.5, md: 11.5 }}
                        fontWeight={500}
                        opacity={0.8}
                        mt={0.3}
                        sx={{ wordBreak: "break-all", overflowWrap: "anywhere" }}
                    >
                        {trend}
                    </Typography>
                )}
            </Box>
        </Paper>
    );
};

export default StatCard;
