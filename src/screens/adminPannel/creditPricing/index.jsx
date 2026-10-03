import { useState, useEffect } from "react";
import {
    Box,
    Typography,
    Paper,
    Chip,
    IconButton,
    Tooltip,
    CircularProgress,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Grid,
} from "@mui/material";
import { toast } from "react-toastify";

// Icons
import RefreshIcon from "@mui/icons-material/Refresh";
import EditIcon from "@mui/icons-material/Edit";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import PaidIcon from "@mui/icons-material/Paid";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import ImageIcon from "@mui/icons-material/Image";
import VideocamIcon from "@mui/icons-material/Videocam";
import MovieFilterIcon from "@mui/icons-material/MovieFilter";
import BoltIcon from "@mui/icons-material/Bolt";
import PsychologyIcon from "@mui/icons-material/Psychology";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import ScheduleIcon from "@mui/icons-material/Schedule";
import SecurityIcon from "@mui/icons-material/Security";

import Header from "../../../components/header";
import Sidebar from "../../../components/sidebar";
import StatCard from "../../../components/statCard";
import CustomInput from "../../../components/customInput";
import CustomButton from "../../../components/customButton";
import { adminMenuItems } from "../../../constants/adminMenuItems";
import useCreditPricing from "../../../hook/credits";

const emptyForm = () => ({
    planName: "",
    pricePerCredit: "",
    defaultCredits: "",
    minCredits: "",
    imageReservationCredits: "",
    videoReservationCredits: "",
    videoEditReservationCredits: "",
    reservationSafetyMultiplier: "2",
});

const CreditPricing = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [formData, setFormData] = useState(emptyForm());
    const [copiedKey, setCopiedKey] = useState("");

    const {
        creditPricing,
        loading,
        updateLoading,
        error,
        fetchCreditPricing,
        updateCreditPricing,
    } = useCreditPricing();

    useEffect(() => {
        fetchCreditPricing();
    }, [fetchCreditPricing]);

    const handleToggleSidebar = () => {
        setCollapsed(!collapsed);
    };

    const copyToClipboard = (text, label = "Copied") => {
        if (!text) return;
        navigator.clipboard.writeText(String(text));
        setCopiedKey(label);
        toast.success(`${label} copied to clipboard!`);
        setTimeout(() => setCopiedKey(""), 2000);
    };

    const data = creditPricing || {};

    const handleOpenEditDialog = () => {
        setFormData({
            planName: data.planName || "",
            pricePerCredit: data.pricePerCredit !== undefined ? String(data.pricePerCredit) : "",
            defaultCredits: data.defaultCredits !== undefined ? String(data.defaultCredits) : "",
            minCredits: data.minCredits !== undefined ? String(data.minCredits) : "",
            imageReservationCredits:
                data.imageReservationCredits !== undefined ? String(data.imageReservationCredits) : "",
            videoReservationCredits:
                data.videoReservationCredits !== undefined ? String(data.videoReservationCredits) : "",
            videoEditReservationCredits:
                data.videoEditReservationCredits !== undefined
                    ? String(data.videoEditReservationCredits)
                    : "",
            reservationSafetyMultiplier:
                data.reservationSafetyMultiplier !== undefined
                    ? String(data.reservationSafetyMultiplier)
                    : "2",
        });
        setIsEditDialogOpen(true);
    };

    const handleCloseEditDialog = () => {
        setIsEditDialogOpen(false);
        setFormData(emptyForm());
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSave = async () => {
        if (!formData.planName.trim()) {
            toast.error("Please enter a plan name");
            return;
        }

        const priceNum = Number(formData.pricePerCredit);
        const defaultNum = Number(formData.defaultCredits);
        const minNum = Number(formData.minCredits);
        const imageNum = Number(formData.imageReservationCredits);
        const videoNum = Number(formData.videoReservationCredits);
        const editNum = Number(formData.videoEditReservationCredits);
        const safetyMultiplierNum = formData.reservationSafetyMultiplier !== "" ? Number(formData.reservationSafetyMultiplier) : 2;

        if (Number.isNaN(priceNum) || priceNum <= 0) {
            toast.error("Please enter a valid price per credit");
            return;
        }

        if (Number.isNaN(safetyMultiplierNum) || safetyMultiplierNum < 1 || safetyMultiplierNum > 10) {
            toast.error("Reservation Safety Multiplier must be between 1 and 10");
            return;
        }

        const payload = {
            planName: formData.planName.trim(),
            pricePerCredit: priceNum,
            defaultCredits: Number.isFinite(defaultNum) ? defaultNum : 100,
            minCredits: Number.isFinite(minNum) ? minNum : 10,
            imageReservationCredits: Number.isFinite(imageNum) ? imageNum : 10,
            videoReservationCredits: Number.isFinite(videoNum) ? videoNum : 2,
            videoEditReservationCredits: Number.isFinite(editNum) ? editNum : 60,
            reservationSafetyMultiplier: safetyMultiplierNum,
        };

        const res = await updateCreditPricing(payload);
        if (res?.success) {
            setIsEditDialogOpen(false);
        }
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return "—";
        try {
            const d = new Date(dateStr);
            return d.toLocaleString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            });
        } catch {
            return String(dateStr);
        }
    };

    const formatCreditValue = (val) => {
        if (val === undefined || val === null) return "—";
        return `${val} ${val === 1 ? "Credit" : "Credits"}`;
    };

    const rateTableData = [
        {
            service: "Reservation Safety Multiplier",
            apiKey: "reservationSafetyMultiplier",
            icon: <SecurityIcon sx={{ color: "#10B981", fontSize: 20 }} />,
            value: data.reservationSafetyMultiplier !== undefined ? `${data.reservationSafetyMultiplier}x` : "2x",
        },
        {
            service: "Image Reservation Credits",
            apiKey: "imageReservationCredits",
            icon: <ImageIcon sx={{ color: "#FF1572", fontSize: 20 }} />,
            value: formatCreditValue(data.imageReservationCredits),
        },
        {
            service: "Video Reservation Credits",
            apiKey: "videoReservationCredits",
            icon: <VideocamIcon sx={{ color: "#5E1321", fontSize: 20 }} />,
            value: formatCreditValue(data.videoReservationCredits),
        },
        {
            service: "Video Edit Reservation Credits",
            apiKey: "videoEditReservationCredits",
            icon: <MovieFilterIcon sx={{ color: "#FF1572", fontSize: 20 }} />,
            value: formatCreditValue(data.videoEditReservationCredits),
        },
        {
            service: "Magica Credit Multiplier",
            apiKey: "magicaCreditMultiplier",
            icon: <BoltIcon sx={{ color: "#F59E0B", fontSize: 20 }} />,
            value: data.magicaCreditMultiplier !== undefined ? `${data.magicaCreditMultiplier}x` : "—",
        },
        {
            service: "OpenAI Input Credits (per 1k tokens)",
            apiKey: "openaiInputCreditsPer1kTokens",
            icon: <PsychologyIcon sx={{ color: "#10B981", fontSize: 20 }} />,
            value: formatCreditValue(data.openaiInputCreditsPer1kTokens),
        },
        {
            service: "OpenAI Output Credits (per 1k tokens)",
            apiKey: "openaiOutputCreditsPer1kTokens",
            icon: <PsychologyIcon sx={{ color: "#3B82F6", fontSize: 20 }} />,
            value: formatCreditValue(data.openaiOutputCreditsPer1kTokens),
        },
    ];

    const features = Array.isArray(data.features) ? data.features : [];

    return (
        <Box sx={{ overflowX: "hidden", maxWidth: "100%", width: "100%", minWidth: 0, boxSizing: "border-box" }}>
            <Header sidebarCollapsed={collapsed} />
            <Sidebar
                menuItems={adminMenuItems}
                activeItem="Credit Pricing"
                collapsed={collapsed}
                onToggle={handleToggleSidebar}
            />

            <Box
                sx={{
                    marginLeft: { xs: 0, sm: 0, md: collapsed ? "80px" : "250px" },
                    marginTop: "5px",
                    minHeight: "calc(100vh - 80px)",
                    backgroundColor: "#f5f5f5",
                    padding: { xs: "12px", sm: "16px", md: "24px" },
                    paddingTop: { xs: "16px", md: "20px" },
                    transition: "margin-left 0.3s ease",
                    maxWidth: { xs: "100%", md: "min(1600px, 100%)" },
                    width: { xs: "100%", md: "auto" },
                    minWidth: 0,
                    overflowX: "hidden",
                    boxSizing: "border-box",
                }}
            >
                {/* Header Title & Actions */}
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: { xs: "stretch", sm: "center" },
                        flexDirection: { xs: "column", sm: "row" },
                        gap: 1.5,
                        mb: 2.5,
                        width: "100%",
                        minWidth: 0,
                    }}
                >
                    <Box sx={{ minWidth: 0, width: "100%" }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
                            <Typography
                                fontSize={{ xs: 20, sm: 24, md: 28 }}
                                fontWeight={700}
                                color="#333333"
                                sx={{ wordBreak: "break-word", overflowWrap: "anywhere" }}
                            >
                                Credit Pricing
                            </Typography>
                            {data.isActive !== undefined && (
                                <Chip
                                    icon={
                                        <FiberManualRecordIcon
                                            sx={{
                                                fontSize: "10px !important",
                                                color: data.isActive ? "#10B981" : "#EF4444",
                                            }}
                                        />
                                    }
                                    label={data.isActive ? "Active Plan" : "Inactive"}
                                    size="small"
                                    sx={{
                                        fontWeight: 600,
                                        bgcolor: data.isActive ? "#ECFDF5" : "#FEF2F2",
                                        color: data.isActive ? "#065F46" : "#991B1B",
                                        borderRadius: "6px",
                                    }}
                                />
                            )}
                        </Box>
                        <Typography
                            fontSize={{ xs: 12, sm: 14 }}
                            color="#666666"
                            mt={0.5}
                            sx={{ wordBreak: "break-word", overflowWrap: "anywhere" }}
                        >
                            {data.planName || "Credit pricing and reservation rules"}
                        </Typography>
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, width: { xs: "100%", sm: "auto" } }}>
                        <Button
                            variant="outlined"
                            onClick={handleOpenEditDialog}
                            disabled={loading || updateLoading}
                            startIcon={<EditIcon sx={{ fontSize: 18 }} />}
                            sx={{
                                color: "#5E1321",
                                borderColor: "#5E1321",
                                textTransform: "none",
                                fontWeight: 600,
                                fontSize: { xs: "12px", sm: "14px" },
                                borderRadius: "8px",
                                px: { xs: 1.5, sm: 2 },
                                py: 0.8,
                                flex: { xs: 1, sm: "none" },
                                whiteSpace: "nowrap",
                                "&:hover": {
                                    borderColor: "#450c17",
                                    bgcolor: "rgba(94, 19, 33, 0.04)",
                                },
                            }}
                        >
                            Edit Pricing
                        </Button>

                        <Button
                            variant="contained"
                            onClick={fetchCreditPricing}
                            disabled={loading || updateLoading}
                            startIcon={
                                loading ? (
                                    <CircularProgress size={16} color="inherit" />
                                ) : (
                                    <RefreshIcon sx={{ fontSize: 18 }} />
                                )
                            }
                            sx={{
                                bgcolor: "#5E1321",
                                color: "white",
                                textTransform: "none",
                                fontWeight: 600,
                                fontSize: { xs: "12px", sm: "14px" },
                                borderRadius: "8px",
                                px: { xs: 1.5, sm: 2.2 },
                                py: 0.8,
                                boxShadow: "none",
                                flex: { xs: 1, sm: "none" },
                                whiteSpace: "nowrap",
                                "&:hover": {
                                    bgcolor: "#450c17",
                                    boxShadow: "0 2px 8px rgba(94, 19, 33, 0.3)",
                                },
                            }}
                        >
                            Refresh
                        </Button>
                    </Box>
                </Box>

                {error && (
                    <Paper
                        elevation={0}
                        sx={{
                            p: 2,
                            mb: 2.5,
                            borderRadius: "10px",
                            bgcolor: "#FEF2F2",
                            border: "1px solid #FEE2E2",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            flexWrap: "wrap",
                            gap: 1.5,
                            width: "100%",
                            boxSizing: "border-box",
                        }}
                    >
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, minWidth: 0, flex: 1 }}>
                            <Box
                                sx={{
                                    width: 32,
                                    height: 32,
                                    borderRadius: "50%",
                                    bgcolor: "#FEE2E2",
                                    color: "#EF4444",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontWeight: 700,
                                    flexShrink: 0,
                                }}
                            >
                                !
                            </Box>
                            <Box sx={{ minWidth: 0 }}>
                                <Typography fontSize={13} fontWeight={700} color="#991B1B" sx={{ wordBreak: "break-word" }}>
                                    Backend Response: {error}
                                </Typography>
                                <Typography fontSize={11} color="#B91C1C">
                                    Please check your token or authorization settings.
                                </Typography>
                            </Box>
                        </Box>
                        <Button
                            size="small"
                            onClick={fetchCreditPricing}
                            sx={{ textTransform: "none", color: "#991B1B", fontWeight: 600 }}
                        >
                            Retry
                        </Button>
                    </Paper>
                )}

                {loading && !creditPricing ? (
                    <Box
                        sx={{
                            minHeight: "50vh",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <CircularProgress sx={{ color: "#FF1572" }} />
                    </Box>
                ) : (
                    <Box sx={{ display: "flex", flexDirection: "column", gap: { xs: 2, md: 2.5 }, width: "100%", minWidth: 0 }}>
                        {/* 4 Stat Overview Cards from Response Fields */}
                        <Box
                            sx={{
                                display: "grid",
                                gridTemplateColumns: {
                                    xs: "1fr",
                                    sm: "repeat(2, minmax(0, 1fr))",
                                    lg: "repeat(4, minmax(0, 1fr))",
                                },
                                gap: { xs: "12px", sm: "16px" },
                                width: "100%",
                                minWidth: 0,
                                boxSizing: "border-box",
                            }}
                        >
                            <StatCard
                                title="Price Per Credit"
                                value={data.pricePerCredit !== undefined ? `$${data.pricePerCredit}` : "—"}
                                icon={<PaidIcon />}
                                color="#5E1321"
                                trend="pricePerCredit"
                            />
                            <StatCard
                                title="Default Credits"
                                value={data.defaultCredits !== undefined ? data.defaultCredits : "—"}
                                icon={<AccountBalanceWalletIcon />}
                                color="#FF1572"
                                trend="defaultCredits"
                            />
                            <StatCard
                                title="Purchase Limits (Min – Max)"
                                value={
                                    data.minCredits !== undefined && data.maxCredits !== undefined
                                        ? `${data.minCredits} – ${data.maxCredits.toLocaleString()}`
                                        : "—"
                                }
                                icon={<SwapVertIcon />}
                                color="#5E1321"
                                trend="minCredits – maxCredits"
                            />
                            <StatCard
                                title="Profit Margin Multiplier"
                                value={data.profitMarginMultiplier !== undefined ? `${data.profitMarginMultiplier}x` : "—"}
                                icon={<TrendingUpIcon />}
                                color="#FF1572"
                                trend="profitMarginMultiplier"
                            />
                        </Box>

                        {/* 2-Column Grid: Plan Profile & Reservation Rules */}
                        <Box
                            sx={{
                                display: "grid",
                                gridTemplateColumns: {
                                    xs: "1fr",
                                    lg: "repeat(2, minmax(0, 1fr))",
                                },
                                gap: { xs: "16px", md: "20px" },
                                width: "100%",
                                minWidth: 0,
                                boxSizing: "border-box",
                            }}
                        >
                            {/* Left: Plan Profile & Features */}
                            <Paper
                                elevation={0}
                                sx={{
                                    p: { xs: 1.5, sm: 2.5, md: 3 },
                                    borderRadius: "14px",
                                    bgcolor: "white",
                                    border: "1px solid #E5E7EB",
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "space-between",
                                    minWidth: 0,
                                    width: "100%",
                                    overflow: "hidden",
                                    boxSizing: "border-box",
                                }}
                            >
                                <Box sx={{ minWidth: 0, width: "100%" }}>
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                                        <AutoAwesomeIcon sx={{ color: "#FF1572", fontSize: 18, flexShrink: 0 }} />
                                        <Typography fontSize={12} fontWeight={700} color="#FF1572" textTransform="uppercase" letterSpacing={0.8}>
                                            Plan Profile
                                        </Typography>
                                    </Box>

                                    <Typography
                                        fontSize={{ xs: 18, sm: 22 }}
                                        fontWeight={700}
                                        color="#5E1321"
                                        mb={1}
                                        sx={{
                                            wordBreak: "break-word",
                                            overflowWrap: "anywhere",
                                            minWidth: 0,
                                            lineHeight: 1.3,
                                        }}
                                    >
                                        {data.planName || "—"}
                                    </Typography>

                                    <Typography
                                        fontSize={{ xs: 13, sm: 14 }}
                                        color="#555555"
                                        lineHeight={1.6}
                                        mb={2}
                                        sx={{
                                            wordBreak: "break-word",
                                            overflowWrap: "anywhere",
                                            minWidth: 0,
                                        }}
                                    >
                                        {data.planDescription || "—"}
                                    </Typography>

                                    {data._id && (
                                        <Box
                                            sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "space-between",
                                                gap: 1,
                                                bgcolor: "#F9FAFB",
                                                border: "1px solid #E5E7EB",
                                                p: { xs: 1, sm: 1.2 },
                                                borderRadius: "8px",
                                                mb: 2.5,
                                                width: "100%",
                                                maxWidth: "100%",
                                                boxSizing: "border-box",
                                                minWidth: 0,
                                            }}
                                        >
                                            <Box sx={{ minWidth: 0, flex: 1, overflow: "hidden" }}>
                                                <Typography
                                                    fontSize={{ xs: 11, sm: 12 }}
                                                    fontFamily="monospace"
                                                    color="#4B5563"
                                                    sx={{
                                                        wordBreak: "break-all",
                                                        overflowWrap: "anywhere",
                                                        lineHeight: 1.4,
                                                    }}
                                                >
                                                    Plan ID: <strong>{data._id}</strong>
                                                </Typography>
                                            </Box>
                                            <Tooltip title={copiedKey === "Plan ID" ? "Copied!" : "Copy Plan ID"}>
                                                <IconButton
                                                    size="small"
                                                    onClick={() => copyToClipboard(data._id, "Plan ID")}
                                                    sx={{
                                                        color: "#6B7280",
                                                        p: 0.5,
                                                        flexShrink: 0,
                                                        bgcolor: "#F3F4F6",
                                                        "&:hover": { bgcolor: "#E5E7EB" },
                                                    }}
                                                >
                                                    <ContentCopyIcon sx={{ fontSize: 14 }} />
                                                </IconButton>
                                            </Tooltip>
                                        </Box>
                                    )}

                                    <Typography fontSize={{ xs: 14, sm: 15 }} fontWeight={700} color="#333333" mb={1.2}>
                                        Included Features ({features.length})
                                    </Typography>

                                    <Box sx={{ display: "flex", flexDirection: "column", gap: 1, width: "100%", minWidth: 0 }}>
                                        {features.length > 0 ? (
                                            features.map((feature, idx) => (
                                                <Box
                                                    key={idx}
                                                    sx={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        gap: 1,
                                                        p: { xs: 0.8, sm: 1.2 },
                                                        borderRadius: "8px",
                                                        bgcolor: "#FDF2F8",
                                                        border: "1px solid #FCE7F3",
                                                        minWidth: 0,
                                                        width: "100%",
                                                        boxSizing: "border-box",
                                                    }}
                                                >
                                                    <CheckCircleOutlineIcon sx={{ color: "#FF1572", fontSize: 16, flexShrink: 0 }} />
                                                    <Typography
                                                        fontSize={{ xs: 12, sm: 14 }}
                                                        fontWeight={600}
                                                        color="#5E1321"
                                                        sx={{
                                                            wordBreak: "break-word",
                                                            overflowWrap: "anywhere",
                                                            minWidth: 0,
                                                            flex: 1,
                                                        }}
                                                    >
                                                        {feature}
                                                    </Typography>
                                                </Box>
                                            ))
                                        ) : (
                                            <Typography fontSize={13} color="#888">
                                                No features configured.
                                            </Typography>
                                        )}
                                    </Box>
                                </Box>

                                <Box
                                    sx={{
                                        mt: 2.5,
                                        pt: 1.5,
                                        borderTop: "1px solid #F3F4F6",
                                        display: "flex",
                                        flexDirection: { xs: "column", sm: "row" },
                                        justifyContent: "space-between",
                                        alignItems: { xs: "flex-start", sm: "center" },
                                        gap: 0.8,
                                        width: "100%",
                                        minWidth: 0,
                                    }}
                                >
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, minWidth: 0 }}>
                                        <ScheduleIcon sx={{ fontSize: 14, color: "#9CA3AF", flexShrink: 0 }} />
                                        <Typography fontSize={11} color="#6B7280" sx={{ wordBreak: "break-word" }}>
                                            Created: {formatDate(data.createdAt)}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, minWidth: 0 }}>
                                        <ScheduleIcon sx={{ fontSize: 14, color: "#9CA3AF", flexShrink: 0 }} />
                                        <Typography fontSize={11} color="#6B7280" sx={{ wordBreak: "break-word" }}>
                                            Updated: {formatDate(data.updatedAt)}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Paper>

                            {/* Right: AI Services & Deduction Rates Table */}
                            <Paper
                                elevation={0}
                                sx={{
                                    p: { xs: 1.5, sm: 2.5, md: 3 },
                                    borderRadius: "14px",
                                    bgcolor: "white",
                                    border: "1px solid #E5E7EB",
                                    display: "flex",
                                    flexDirection: "column",
                                    minWidth: 0,
                                    width: "100%",
                                    overflow: "hidden",
                                    boxSizing: "border-box",
                                }}
                            >
                                <Typography
                                    fontSize={{ xs: 16, sm: 18 }}
                                    fontWeight={700}
                                    color="#333333"
                                    mb={0.5}
                                    sx={{ wordBreak: "break-word", overflowWrap: "anywhere" }}
                                >
                                    Reservation & Token Multiplier Rates
                                </Typography>
                                <Typography
                                    fontSize={{ xs: 12, sm: 13 }}
                                    color="#666666"
                                    mb={2}
                                    sx={{ wordBreak: "break-word", overflowWrap: "anywhere" }}
                                >
                                    Exact rates and multipliers received from <code>/credits/pricing</code>
                                </Typography>

                                <TableContainer
                                    sx={{
                                        borderRadius: "10px",
                                        border: "1px solid #F3F4F6",
                                        width: "100%",
                                        maxWidth: "100%",
                                        overflowX: "auto",
                                        boxSizing: "border-box",
                                        minWidth: 0,
                                        "&::-webkit-scrollbar": { height: "6px" },
                                        "&::-webkit-scrollbar-thumb": { bgcolor: "rgba(94, 19, 33, 0.2)", borderRadius: "4px" },
                                    }}
                                >
                                    <Table size="small" sx={{ width: "100%", minWidth: { xs: 260, sm: 300 } }}>
                                        <TableHead sx={{ bgcolor: "#5E1321" }}>
                                            <TableRow>
                                                <TableCell
                                                    sx={{
                                                        color: "white",
                                                        fontWeight: 600,
                                                        fontSize: { xs: "11px", sm: "13px" },
                                                        py: 1.2,
                                                        px: { xs: 1, sm: 1.5 },
                                                    }}
                                                >
                                                    Field / Configuration Key
                                                </TableCell>
                                                <TableCell
                                                    sx={{
                                                        color: "white",
                                                        fontWeight: 600,
                                                        fontSize: { xs: "11px", sm: "13px" },
                                                        py: 1.2,
                                                        px: { xs: 1, sm: 1.5 },
                                                        whiteSpace: "nowrap",
                                                    }}
                                                    align="right"
                                                >
                                                    Value
                                                </TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {rateTableData.map((row) => (
                                                <TableRow
                                                    key={row.apiKey}
                                                    sx={{
                                                        bgcolor: "#ffffff",
                                                        "&:hover": { bgcolor: "#FFF5F7" },
                                                    }}
                                                >
                                                    <TableCell sx={{ py: 1.2, px: { xs: 1, sm: 1.5 }, minWidth: 0 }}>
                                                        <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1, minWidth: 0 }}>
                                                            <Box sx={{ flexShrink: 0, display: "flex", mt: 0.2 }}>
                                                                {row.icon}
                                                            </Box>
                                                            <Box sx={{ minWidth: 0, flex: 1 }}>
                                                                <Typography
                                                                    fontSize={{ xs: 11.5, sm: 13 }}
                                                                    fontWeight={600}
                                                                    color="#333333"
                                                                    sx={{
                                                                        wordBreak: "break-word",
                                                                        overflowWrap: "anywhere",
                                                                        lineHeight: 1.3,
                                                                    }}
                                                                >
                                                                    {row.service}
                                                                </Typography>
                                                                <Typography
                                                                    fontSize={9.5}
                                                                    color="#9CA3AF"
                                                                    fontFamily="monospace"
                                                                    sx={{
                                                                        wordBreak: "break-all",
                                                                        overflowWrap: "anywhere",
                                                                        mt: 0.2,
                                                                    }}
                                                                >
                                                                    {row.apiKey}
                                                                </Typography>
                                                            </Box>
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell sx={{ py: 1.2, px: { xs: 1, sm: 1.5 }, verticalAlign: "middle" }} align="right">
                                                        <Chip
                                                            label={row.value}
                                                            size="small"
                                                            sx={{
                                                                fontWeight: 700,
                                                                fontSize: { xs: "10px", sm: "11.5px" },
                                                                bgcolor: "#FDF2F8",
                                                                color: "#FF1572",
                                                                border: "1px solid #FCE7F3",
                                                                height: "auto",
                                                                py: { xs: 0.3, sm: 0.4 },
                                                                px: { xs: 0.4, sm: 0.8 },
                                                                "& .MuiChip-label": {
                                                                    px: { xs: 0.4, sm: 0.8 },
                                                                    whiteSpace: "nowrap",
                                                                },
                                                            }}
                                                        />
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Paper>
                        </Box>
                    </Box>
                )}
            </Box>

            {/* Edit Credit Pricing Dialog */}
            <Dialog
                open={isEditDialogOpen}
                onClose={handleCloseEditDialog}
                fullWidth
                maxWidth="sm"
                PaperProps={{
                    sx: {
                        borderRadius: { xs: "12px", sm: "16px" },
                        p: { xs: 0.5, sm: 1 },
                        m: { xs: 1, sm: 2 },
                        maxHeight: "90vh",
                    },
                }}
            >
                <DialogTitle sx={{ fontWeight: 700, color: "#5E1321", fontSize: { xs: 17, sm: 20 }, px: { xs: 2, sm: 3 } }}>
                    Edit Credit Pricing Configuration
                </DialogTitle>
                <DialogContent sx={{ pt: "8px !important", px: { xs: 2, sm: 3 } }}>
                    <Typography fontSize={13} fontWeight={600} color="#333333" mt={1} mb={0.5}>
                        Plan Name
                    </Typography>
                    <CustomInput
                        margin="dense"
                        name="planName"
                        value={formData.planName}
                        onChange={handleInputChange}
                        fullWidth
                        backgroundColor="#fff"
                        borderRadius="10px"
                        placeholder="e.g. Unlock AI Premium Feature"
                    />

                    <Grid container spacing={1.5} sx={{ mt: 0.5 }}>
                        <Grid item xs={12} sm={6}>
                            <Typography fontSize={13} fontWeight={600} color="#333333" mb={0.5}>
                                Price Per Credit (USD)
                            </Typography>
                            <CustomInput
                                margin="dense"
                                name="pricePerCredit"
                                type="number"
                                value={formData.pricePerCredit}
                                onChange={handleInputChange}
                                fullWidth
                                backgroundColor="#fff"
                                borderRadius="10px"
                                placeholder="0.1999"
                                inputProps={{ step: "any" }}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <Typography fontSize={13} fontWeight={600} color="#333333" mb={0.5}>
                                Default Credits
                            </Typography>
                            <CustomInput
                                margin="dense"
                                name="defaultCredits"
                                type="number"
                                value={formData.defaultCredits}
                                onChange={handleInputChange}
                                fullWidth
                                backgroundColor="#fff"
                                borderRadius="10px"
                                placeholder="100"
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <Typography fontSize={13} fontWeight={600} color="#333333" mb={0.5}>
                                Minimum Credits
                            </Typography>
                            <CustomInput
                                margin="dense"
                                name="minCredits"
                                type="number"
                                value={formData.minCredits}
                                onChange={handleInputChange}
                                fullWidth
                                backgroundColor="#fff"
                                borderRadius="10px"
                                placeholder="10"
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <Typography fontSize={13} fontWeight={600} color="#333333" mb={0.5}>
                                Image Reservation Credits
                            </Typography>
                            <CustomInput
                                margin="dense"
                                name="imageReservationCredits"
                                type="number"
                                value={formData.imageReservationCredits}
                                onChange={handleInputChange}
                                fullWidth
                                backgroundColor="#fff"
                                borderRadius="10px"
                                placeholder="10"
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <Typography fontSize={13} fontWeight={600} color="#333333" mb={0.5}>
                                Video Reservation Credits
                            </Typography>
                            <CustomInput
                                margin="dense"
                                name="videoReservationCredits"
                                type="number"
                                value={formData.videoReservationCredits}
                                onChange={handleInputChange}
                                fullWidth
                                backgroundColor="#fff"
                                borderRadius="10px"
                                placeholder="2"
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <Typography fontSize={13} fontWeight={600} color="#333333" mb={0.5}>
                                Video Edit Reservation Credits
                            </Typography>
                            <CustomInput
                                margin="dense"
                                name="videoEditReservationCredits"
                                type="number"
                                value={formData.videoEditReservationCredits}
                                onChange={handleInputChange}
                                fullWidth
                                backgroundColor="#fff"
                                borderRadius="10px"
                                placeholder="60"
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <Typography fontSize={13} fontWeight={600} color="#333333" mb={0.5}>
                                Reservation Safety Multiplier (1 – 10)
                            </Typography>
                            <CustomInput
                                margin="dense"
                                name="reservationSafetyMultiplier"
                                type="number"
                                value={formData.reservationSafetyMultiplier}
                                onChange={handleInputChange}
                                fullWidth
                                backgroundColor="#fff"
                                borderRadius="10px"
                                placeholder="2"
                                inputProps={{ min: 1, max: 10, step: 1 }}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions sx={{ px: { xs: 2, sm: 3 }, pb: 2, pt: 1 }}>
                    <CustomButton
                        variant="text"
                        handlePressBtn={handleCloseEditDialog}
                        btnLabel="Cancel"
                        disabled={updateLoading}
                    />
                    <CustomButton
                        variant="contained"
                        handlePressBtn={handleSave}
                        btnLabel="Save Changes"
                        disabled={updateLoading}
                        loading={updateLoading}
                    />
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default CreditPricing;
