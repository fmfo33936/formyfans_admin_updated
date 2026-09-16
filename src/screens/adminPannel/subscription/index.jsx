import {
    Box,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControlLabel,
    Switch,
    Typography,
} from "@mui/material";
import { useCallback, useEffect, useMemo, useState } from "react";
import CustomInput from "../../../components/customInput";
import CustomButton from "../../../components/customButton";
import Header from "../../../components/header";
import Sidebar from "../../../components/sidebar";
import SubscriptionCard from "./subscriptionCard";
import useSubscription from "../../../hook/subscription";
import { adminMenuItems } from "../../../constants/adminMenuItems";

const emptyForm = () => ({
    _id: "",
    name: "",
    price: "",
    durationDays: "",
    featuresStr: "",
    stripePriceId: "",
    isActive: true,
});

const Subscription = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
    const [isFirstLoadDone, setIsFirstLoadDone] = useState(false);
    const {
        subscriptionPlans,
        loading,
        updateLoading,
        getSubscriptionPlans,
        updateSubscriptionPlan,
    } = useSubscription();
    const [selectedPackage, setSelectedPackage] = useState(() => emptyForm());

    const handleToggleSidebar = () => {
        setCollapsed(!collapsed);
    };

    useEffect(() => {
        const loadPlans = async () => {
            await getSubscriptionPlans();
            setIsFirstLoadDone(true);
        };
        loadPlans();
    }, [getSubscriptionPlans]);

    const subscriptionPackages = useMemo(() => {
        if (!Array.isArray(subscriptionPlans)) return [];
        return subscriptionPlans.map((plan) => {
            const id = plan?._id ?? plan?.id ?? "";
            const name = plan?.packageName || plan?.name || "Untitled Plan";
            const amount = plan?.price ?? plan?.amount ?? 0;
            return {
                _id: id,
                packageName: name,
                price: `$${amount} / month`,
                description:
                    plan?.description ||
                    (Array.isArray(plan?.features) ? plan.features.join(", ") : "") ||
                    "No description available.",
                rawPlan: plan,
            };
        });
    }, [subscriptionPlans]);

    const isPageLoading = !isFirstLoadDone || loading;

    const handleOpenUpdateDialog = (pkg) => {
        const plan = pkg.rawPlan ?? {};
        const id = plan._id ?? plan.id ?? pkg._id ?? "";
        const name = plan.name ?? plan.packageName ?? pkg.packageName ?? "";
        const priceVal = plan.price ?? plan.amount ?? "";
        const duration = plan.durationDays ?? 30;
        const features = Array.isArray(plan.features) ? plan.features.join(", ") : "";
        setSelectedPackage({
            _id: id,
            name: String(name),
            price: priceVal === "" || priceVal == null ? "" : String(priceVal),
            durationDays: String(duration),
            featuresStr: features,
            stripePriceId: plan.stripePriceId ?? "",
            isActive: plan.isActive !== false,
        });
        setIsUpdateDialogOpen(true);
    };

    const handleCloseUpdateDialog = () => {
        setIsUpdateDialogOpen(false);
        setSelectedPackage(emptyForm());
    };

    const handleInputChange = (event) => {
        const { name, value, type, checked } = event.target;
        setSelectedPackage((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSave = useCallback(async () => {
        if (!selectedPackage._id) {
            return;
        }
        const priceNum = Number.parseFloat(
            String(selectedPackage.price).replace(/[^0-9.]/g, ""),
        );
        const durationNum = Number.parseInt(String(selectedPackage.durationDays), 10);
        const features = String(selectedPackage.featuresStr || "")
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean);
        const payload = {
            name: String(selectedPackage.name || "").trim(),
            price: Number.isFinite(priceNum) ? priceNum : 0,
            durationDays:
                Number.isFinite(durationNum) && durationNum > 0 ? durationNum : 30,
            features,
            stripePriceId: String(selectedPackage.stripePriceId || "").trim() || null,
            isActive: Boolean(selectedPackage.isActive),
        };
        if (!payload.name) {
            return;
        }
        const res = await updateSubscriptionPlan(selectedPackage._id, payload);
        if (res?.success) {
            setIsUpdateDialogOpen(false);
            setSelectedPackage(emptyForm());
        }
    }, [selectedPackage, updateSubscriptionPlan]);

    return (
        <Box sx={{ overflowX: "hidden", maxWidth: "100%" }}>
            <Header sidebarCollapsed={collapsed} />
            <Sidebar
                menuItems={adminMenuItems}
                activeItem="Subscription"
                collapsed={collapsed}
                onToggle={handleToggleSidebar}
            />
            <Box
                sx={{
                    marginLeft: { xs: 0, sm: 0, md: collapsed ? "80px" : "250px" },
                    minHeight: "calc(100vh - 80px)",
                    backgroundColor: "background.default",
                    padding: { xs: "16px", sm: "20px", md: "24px" },
                    paddingTop: "32px",
                    transition: "margin-left 0.3s ease",
                    maxWidth: { xs: "100%", md: "min(1600px, 100%)" },
                    width: { xs: "100%", md: "auto" },
                    minWidth: 0,
                    overflowX: "hidden",
                    boxSizing: "border-box",
                }}
            >
                <Typography fontSize={{ xs: 24, md: 28 }} fontWeight={700} color="text.primary" mb={2}>
                    Subscription
                </Typography>
                {isPageLoading ? (
                    <Box
                        sx={{
                            minHeight: "50vh",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <CircularProgress />
                    </Box>
                ) : (
                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: {
                                xs: "1fr",
                                sm: "repeat(2, minmax(0, 1fr))",
                                lg: "repeat(3, minmax(0, 1fr))",
                            },
                            gap: "20px",
                        }}
                    >
                        {subscriptionPackages.map((subscriptionPackage) => (
                            <SubscriptionCard
                                key={subscriptionPackage._id || subscriptionPackage.packageName}
                                packageName={subscriptionPackage.packageName}
                                price={subscriptionPackage.price}
                                description={subscriptionPackage.description}
                                onUpdate={() => handleOpenUpdateDialog(subscriptionPackage)}
                            />
                        ))}
                    </Box>
                )}
            </Box>
            <Dialog open={isUpdateDialogOpen} onClose={handleCloseUpdateDialog} fullWidth maxWidth="sm">
                <DialogTitle>Update Subscription Package</DialogTitle>
                <DialogContent sx={{ pt: "10px !important" }}>
                    <Typography fontSize={14} fontWeight={600} color="text.primary" mt={1}>
                        Name
                    </Typography>
                    <CustomInput
                        margin="dense"
                        name="name"
                        value={selectedPackage.name}
                        onChange={handleInputChange}
                        fullWidth
                        backgroundColor="#fff"
                        borderRadius="10px"
                    />
                    <Typography fontSize={14} fontWeight={600} color="text.primary" mt={1}>
                        Price (number)
                    </Typography>
                    <CustomInput
                        margin="dense"
                        name="price"
                        value={selectedPackage.price}
                        onChange={handleInputChange}
                        fullWidth
                        backgroundColor="#fff"
                        borderRadius="10px"
                    />
                    <Typography fontSize={14} fontWeight={600} color="text.primary" mt={1}>
                        Duration (days)
                    </Typography>
                    <CustomInput
                        margin="dense"
                        name="durationDays"
                        value={selectedPackage.durationDays}
                        onChange={handleInputChange}
                        fullWidth
                        backgroundColor="#fff"
                        borderRadius="10px"
                    />
                    <Typography fontSize={14} fontWeight={600} color="text.primary" mt={1}>
                        Stripe Price ID
                    </Typography>
                    <CustomInput
                        margin="dense"
                        name="stripePriceId"
                        value={selectedPackage.stripePriceId}
                        onChange={handleInputChange}
                        placeholder="price_..."
                        fullWidth
                        backgroundColor="#fff"
                        borderRadius="10px"
                    />
                    <Typography fontSize={14} fontWeight={600} color="text.primary" mt={1}>
                        Features (comma separated)
                    </Typography>
                    <CustomInput
                        margin="dense"
                        name="featuresStr"
                        value={selectedPackage.featuresStr}
                        onChange={handleInputChange}
                        fullWidth
                        multiline
                        minRows={3}
                        backgroundColor="#fff"
                        borderRadius="10px"
                    />
                    {/* <FormControlLabel
                        sx={{ mt: 1 }}
                        control={
                            <Switch
                                name="isActive"
                                checked={selectedPackage.isActive}
                                onChange={handleInputChange}
                                color="secondary"
                            />
                        }
                        label="Active"
                    /> */}
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <CustomButton
                        variant="text"
                        handlePressBtn={handleCloseUpdateDialog}
                        btnLabel="Cancel"
                        disabled={updateLoading}
                    />
                    <CustomButton
                        variant="contained"
                        handlePressBtn={handleSave}
                        btnLabel="Save"
                        disabled={updateLoading || !selectedPackage._id}
                        loading={updateLoading}
                    />
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Subscription;
