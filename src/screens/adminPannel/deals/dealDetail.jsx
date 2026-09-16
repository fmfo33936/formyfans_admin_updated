import {
    Avatar,
    Box,
    Chip,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import CustomButton from "../../../components/customButton";
import CustomInput from "../../../components/customInput";
import Header from "../../../components/header";
import Sidebar from "../../../components/sidebar";
import { adminMenuItems } from "../../../constants/adminMenuItems";
import useDeals from "../../../hook/deals";
import {
    formatAmount,
    formatDealDate,
    formatDealDateTime,
    formatDeliverables,
    formatPersonName,
    getDealStatusStyle,
    getPaymentStatusStyle,
    isIncompleteDeal,
} from "../../../utils/dealHelpers";

const StatusChip = ({ status, styleFn }) => {
    if (!status) return "—";
    const label = String(status).replace(/-/g, " ");
    return (
        <Chip
            label={label}
            size="small"
            sx={{
                height: 28,
                fontSize: 12,
                fontWeight: 600,
                textTransform: "capitalize",
                border: "none",
                "& .MuiChip-label": { px: 1.5 },
                ...styleFn(status),
            }}
        />
    );
};

const InfoRow = ({ label, children }) => (
    <Box
        sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "160px 1fr" },
            gap: { xs: 0.5, sm: 2 },
            py: 1.25,
            borderBottom: "1px solid #f0f0f0",
            alignItems: "start",
        }}
    >
        <Typography fontSize={13} fontWeight={600} color="#888">
            {label}
        </Typography>
        <Box sx={{ minWidth: 0 }}>{children}</Box>
    </Box>
);

const PersonCard = ({ label, person }) => (
    <Box
        sx={{
            flex: 1,
            minWidth: 220,
            bgcolor: "#fafafa",
            borderRadius: 2,
            p: 2,
            border: "1px solid #eee",
        }}
    >
        <Typography fontSize={12} fontWeight={600} color="#888" mb={1.25}>
            {label}
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Avatar
                src={person?.image || undefined}
                alt={formatPersonName(person)}
                sx={{ width: 48, height: 48 }}
            />
            <Box sx={{ minWidth: 0 }}>
                <Typography fontSize={15} fontWeight={700} color="#5E1321" noWrap>
                    {formatPersonName(person)}
                </Typography>
                {person?.username ? (
                    <Typography fontSize={13} color="#888" noWrap>
                        @{person.username}
                    </Typography>
                ) : null}
            </Box>
        </Box>
    </Box>
);

const ValueText = ({ children, sx }) => (
    <Typography
        fontSize={14}
        fontWeight={600}
        color="#333"
        sx={{ wordBreak: "break-word", ...sx }}
    >
        {children}
    </Typography>
);

const DealDetail = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const dealId = searchParams.get("dealId") ?? "";

    const [collapsed, setCollapsed] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [note, setNote] = useState("");
    const {
        dealDetail,
        detailLoading,
        verifyLoading,
        fetchDealById,
        verifyIncompleteDeal,
    } = useDeals();

    useEffect(() => {
        if (dealId) {
            fetchDealById(dealId);
        }
    }, [dealId, fetchDealById]);

    const handleToggleSidebar = () => {
        setCollapsed(!collapsed);
    };

    const handleOpenModal = () => {
        setNote("");
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        if (verifyLoading) return;
        setIsModalOpen(false);
        setNote("");
    };

    const handleConfirmMarkComplete = useCallback(async () => {
        const trimmedNote = note.trim();
        if (!dealId || !trimmedNote) return;

        const res = await verifyIncompleteDeal(dealId, trimmedNote);
        if (res?.success) {
            setIsModalOpen(false);
            setNote("");
        }
    }, [dealId, note, verifyIncompleteDeal]);

    const deal = dealDetail;
    const showMarkComplete = isIncompleteDeal(deal?.status);

    return (
        <Box sx={{ overflowX: "hidden", maxWidth: "100%" }}>
            <Header sidebarCollapsed={collapsed} />
            <Sidebar
                menuItems={adminMenuItems}
                activeItem="Deals"
                collapsed={collapsed}
                onToggle={handleToggleSidebar}
            />
            <Box
                sx={{
                    marginLeft: { xs: 0, sm: 0, md: collapsed ? "80px" : "250px" },
                    backgroundColor: "#f5f5f5",
                    padding: { xs: "16px", sm: "20px", md: "24px" },
                    paddingTop: "32px",
                    transition: "margin-left 0.3s ease",
                    maxWidth: { xs: "100%", md: "min(1600px, 100%)" },
                    width: { xs: "100%", md: "auto" },
                    minWidth: 0,
                    minHeight: "calc(100vh - 80px)",
                    boxSizing: "border-box",
                    overflowX: "hidden",
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 2,
                        flexWrap: "wrap",
                        mb: 3,
                    }}
                >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                        <CustomButton
                            btnLabel="Back"
                            startIcon={<ArrowBackIcon />}
                            handlePressBtn={() => navigate("/app/deals")}
                            btnBgColor="#fff"
                            btnTextColor="#5E1321"
                            borderColor="#5E1321"
                            isBorder
                            btnPadding="8px 14px"
                            height="40px"
                            borderRadius="10px"
                            textWeight={600}
                        />
                        <Typography fontSize={{ xs: 22, md: 28 }} fontWeight={700} color="#333">
                            Deal Details
                        </Typography>
                    </Box>

                    {showMarkComplete ? (
                        <CustomButton
                            btnLabel="Mark Complete"
                            handlePressBtn={handleOpenModal}
                            btnBgColor="#5E1321"
                            btnHoverColor="#4a0f1a"
                            btnPadding="10px 18px"
                            height="42px"
                            borderRadius="10px"
                            textWeight={600}
                            disabled={detailLoading || verifyLoading}
                        />
                    ) : null}
                </Box>

                {detailLoading ? (
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            minHeight: 280,
                        }}
                    >
                        <CircularProgress sx={{ color: "#5E1321" }} />
                    </Box>
                ) : !deal ? (
                    <Box
                        sx={{
                            bgcolor: "#fff",
                            borderRadius: 2,
                            p: 4,
                            textAlign: "center",
                            border: "1px solid #eee",
                        }}
                    >
                        <Typography fontSize={15} color="#666">
                            {dealId ? "Deal not found." : "Deal id is missing."}
                        </Typography>
                    </Box>
                ) : (
                    <Box
                        sx={{
                            bgcolor: "#fff",
                            borderRadius: 2,
                            p: { xs: 2, md: 3 },
                            border: "1px solid #eee",
                        }}
                    >
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                gap: 2,
                                flexWrap: "wrap",
                                mb: 2,
                            }}
                        >
                            <Box>
                                <Typography fontSize={22} fontWeight={700} color="#5E1321">
                                    {deal.title || "Untitled Deal"}
                                </Typography>
                                <Typography fontSize={14} color="#888" mt={0.5}>
                                    Brand: {deal.brand || "—"}
                                </Typography>
                            </Box>
                            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                                <StatusChip status={deal.status} styleFn={getDealStatusStyle} />
                                <StatusChip
                                    status={deal.paymentStatus}
                                    styleFn={getPaymentStatusStyle}
                                />
                            </Box>
                        </Box>

                        <Divider sx={{ mb: 2 }} />

                        <Box
                            sx={{
                                display: "flex",
                                gap: 2,
                                flexWrap: "wrap",
                                mb: 2.5,
                            }}
                        >
                            <PersonCard label="Sender" person={deal.sender} />
                            <PersonCard label="Receiver" person={deal.receiver} />
                        </Box>

                        <InfoRow label="Amount">
                            <ValueText>{formatAmount(deal.amount, deal.currency)}</ValueText>
                        </InfoRow>
                        <InfoRow label="Payment Type">
                            <ValueText sx={{ textTransform: "capitalize" }}>
                                {deal.paymentType || "—"}
                            </ValueText>
                        </InfoRow>
                        <InfoRow label="Description">
                            <ValueText>{deal.description || "—"}</ValueText>
                        </InfoRow>
                        <InfoRow label="Deliverables">
                            <ValueText sx={{ textTransform: "capitalize" }}>
                                {formatDeliverables(deal.deliverables)}
                            </ValueText>
                        </InfoRow>
                        <InfoRow label="Deadline">
                            <ValueText>{formatDealDate(deal.deadline)}</ValueText>
                        </InfoRow>
                        <InfoRow label="Reviewed">
                            <ValueText>{deal.isReviewed ? "Yes" : "No"}</ValueText>
                        </InfoRow>
                        <InfoRow label="Created At">
                            <ValueText>{formatDealDateTime(deal.createdAt)}</ValueText>
                        </InfoRow>
                        <InfoRow label="Updated At">
                            <ValueText>{formatDealDateTime(deal.updatedAt)}</ValueText>
                        </InfoRow>
                        {deal.respondedAt ? (
                            <InfoRow label="Responded At">
                                <ValueText>{formatDealDateTime(deal.respondedAt)}</ValueText>
                            </InfoRow>
                        ) : null}
                        {deal.startedAt ? (
                            <InfoRow label="Started At">
                                <ValueText>{formatDealDateTime(deal.startedAt)}</ValueText>
                            </InfoRow>
                        ) : null}
                        {deal.completedAt ? (
                            <InfoRow label="Completed At">
                                <ValueText>{formatDealDateTime(deal.completedAt)}</ValueText>
                            </InfoRow>
                        ) : null}

                        {Array.isArray(deal.statusHistory) && deal.statusHistory.length > 0 ? (
                            <Box mt={3}>
                                <Typography fontSize={16} fontWeight={700} color="#333" mb={1.5}>
                                    Status History
                                </Typography>
                                <Box
                                    sx={{
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: 1.25,
                                    }}
                                >
                                    {[...deal.statusHistory]
                                        .slice()
                                        .reverse()
                                        .map((item) => (
                                            <Box
                                                key={item._id || `${item.status}-${item.changedAt}`}
                                                sx={{
                                                    p: 1.5,
                                                    borderRadius: 1.5,
                                                    bgcolor: "#fafafa",
                                                    border: "1px solid #eee",
                                                }}
                                            >
                                                <Box
                                                    sx={{
                                                        display: "flex",
                                                        justifyContent: "space-between",
                                                        gap: 1,
                                                        flexWrap: "wrap",
                                                        mb: 0.5,
                                                    }}
                                                >
                                                    <StatusChip
                                                        status={item.status}
                                                        styleFn={getDealStatusStyle}
                                                    />
                                                    <Typography fontSize={12} color="#888">
                                                        {formatDealDateTime(item.changedAt)}
                                                    </Typography>
                                                </Box>
                                                {item.note ? (
                                                    <Typography fontSize={13} color="#555">
                                                        {item.note}
                                                    </Typography>
                                                ) : null}
                                            </Box>
                                        ))}
                                </Box>
                            </Box>
                        ) : null}
                    </Box>
                )}
            </Box>

            <Dialog open={isModalOpen} onClose={handleCloseModal} fullWidth maxWidth="sm">
                <DialogTitle sx={{ fontWeight: 700 }}>Mark Deal Complete</DialogTitle>
                <DialogContent sx={{ pt: "10px !important" }}>
                    <Typography fontSize={14} color="#666" mb={1.5}>
                        {deal?.title ? (
                            <>
                                Deal: <strong>{deal.title}</strong>
                            </>
                        ) : (
                            "Add a note before marking this incomplete deal as complete."
                        )}
                    </Typography>
                    <Typography fontSize={14} fontWeight={600} color="#333" mb={0.5}>
                        Note
                    </Typography>
                    <CustomInput
                        name="note"
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        fullWidth
                        multiline
                        minRows={3}
                        placeholder="Write a note..."
                        backgroundColor="#fff"
                        borderRadius="10px"
                        disabled={verifyLoading}
                    />
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <CustomButton
                        variant="text"
                        handlePressBtn={handleCloseModal}
                        btnLabel="Cancel"
                        disabled={verifyLoading}
                    />
                    <CustomButton
                        variant="contained"
                        handlePressBtn={handleConfirmMarkComplete}
                        btnLabel="Done"
                        btnBgColor="#5E1321"
                        btnHoverColor="#4a0f1a"
                        disabled={verifyLoading || !note.trim()}
                        loading={verifyLoading}
                    />
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default DealDetail;
