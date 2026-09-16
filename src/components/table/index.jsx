import { Box, Typography, Switch, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useNavigate } from "react-router-dom";

const Table = ({ headers, data, sx = {}, onToggleStatus, onEdit, onView, viewPath }) => {
    const navigate = useNavigate();
    const renderCell = (value, header, row) => {
        if (header.key === "status" && typeof value === "boolean") {
            return (
                <Switch
                    checked={value}
                    onChange={() => onToggleStatus && onToggleStatus(row)}
                    sx={{
                        "& .MuiSwitch-switchBase.Mui-checked": {
                            color: "#0CA904",
                        },
                        "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                            backgroundColor: "#0CA904",
                        },
                    }}
                />
            );
        }

        if (header.key === "actions") {
            return (
                <IconButton
                    onClick={() => {
                        onEdit && onEdit(row);
                        navigate('/create-product');
                    }}
                    sx={{
                        color: "#5E1321",
                        "&:hover": {
                            backgroundColor: "rgba(94, 19, 33, 0.1)",
                        },
                    }}
                >
                    <EditIcon />
                </IconButton>
            );
        }

        if (header.key === "button" && header.label === "View Details") {
            return (
                <IconButton
                    onClick={() => {
                        if (onView) {
                            onView(row);
                        } else if (viewPath) {
                            navigate(`${viewPath}?id=${row.orderId || row.id}`);
                        }
                    }}
                    sx={{
                        color: "#5E1321",
                        "&:hover": {
                            backgroundColor: "rgba(94, 19, 33, 0.1)",
                        },
                    }}
                >
                    <VisibilityIcon />
                </IconButton>
            );
        }

        if (typeof value === "boolean") {
            return (
                <Box
                    sx={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        px: 2,
                        py: 0.5,
                        color: value ?"#5E1321":'#0CA904',
                        fontSize: "12px",
                        fontWeight: 600,
                    }}
                >
                    {value ? "Active" : "Inactive"}
                </Box>
            );
        }

        if (typeof value === "string" && (value.includes("/images/") || value.includes("assets/") || value.startsWith("data:") || value.startsWith("http"))) {
            return (
                <Box display={'flex'} gap={2} alignItems={'center'}>
                    <Box
                        component="img"
                        src={value}
                        alt="product"
                        sx={{
                            width: 50,
                            height: 50,
                            borderRadius: 2,
                            objectFit: "cover",
                        }}
                    />
                    {row.name && (
                        <Typography fontSize={16} fontWeight={600} color="#5E1321">
                            {row.name}
                        </Typography>
                    )}
                </Box>
            );
        }

        return (
            <Typography fontSize={16} fontWeight={600} color="#5E1321">
                {value}
            </Typography>
        );
    };

    return (
        <Box sx={{ width: "100%", ...sx }}>
            <Box>
                {/* Table Header */}
                <Box
                    sx={{
                        display: "flex",
                        bgcolor: "#5E1321",
                        borderRadius: "8px 8px 0 0",
                        py: 2,
                        px: 3,
                        alignItems: 'center',
                    }}
                >
                    {headers.map((header, index) => (
                        <Box
                            key={index}
                            sx={{
                                flex: header.flex || 1,
                                textAlign: header.align || "left",
                            }}
                        >
                            <Typography fontSize={16} fontWeight={600} color="white">
                                {header.label}
                            </Typography>
                        </Box>
                    ))}
                </Box>

                {/* Table Body */}
                <Box sx={{ bgcolor: "white", borderRadius: "0 0 8px 8px" }}>
                    {data.map((row, rowIndex) => (
                        <Box
                            key={rowIndex}
                            sx={{
                                display: "flex",
                                py: 2,
                                px: 3,
                                alignItems: 'center',
                                borderBottom:
                                    rowIndex < data.length - 1
                                        ? "1px solid #E0E0E0"
                                        : "none",
                                "&:hover": { bgcolor: "#FAFAFA" },
                            }}
                        >
                            {headers.map((header, colIndex) => (
                                <Box
                                    key={colIndex}
                                    sx={{
                                        flex: header.flex || 1,
                                        textAlign: header.align || "left",
                                    }}
                                >
                                    {renderCell(row[header.key], header, row)}
                                </Box>
                            ))}
                        </Box>
                    ))}
                </Box>
            </Box>
        </Box>
    );
};

export default Table;
