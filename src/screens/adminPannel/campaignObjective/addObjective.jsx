import {
    Box,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    Typography,
} from "@mui/material";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import CustomInput from "../../../components/customInput";
import CustomButton from "../../../components/customButton";
import { useCampaignObjectives } from "../../../hook/campaignObjective";
import { uploadMediaService } from "../../../utils/helper";
import { getFullS3Url } from "../../../utils/s3Helper";

const emptyForm = () => ({
    name: "",
    description: "",
    icon: "",
});

const emptyErrors = () => ({
    name: "",
    description: "",
    icon: "",
});

const inputSx = {
    "& .MuiOutlinedInput-root": {
        borderRadius: "10px",
        border: "1px solid #D9D9D9",
        backgroundColor: "#FFFFFF",
        "&:hover": { borderColor: "#BDBDBD" },
        "&.Mui-focused": { borderColor: "#FF1572" },
        "&.Mui-error": { borderColor: "error.main" },
    },
    "& .MuiInputBase-input": {
        padding: "11px 14px",
        fontSize: "14px",
    },
    "& .MuiFormHelperText-root.Mui-error": {
        marginLeft: 0,
        color: "error.main",
    },
};

const FieldLabel = ({ children }) => (
    <Typography fontSize={14} fontWeight={600} color="text.primary" mt={1.5} mb={0.5}>
        {children}
    </Typography>
);

const AddCampaignObjective = ({ open, onClose, onSuccess, editItem = null }) => {
    const {
        createObjective,
        updateObjective,
        createLoading,
        updateLoading,
    } = useCampaignObjectives();
    const [form, setForm] = useState(emptyForm);
    const [errors, setErrors] = useState(emptyErrors);
    const [iconUploading, setIconUploading] = useState(false);
    const fileInputRef = useRef(null);

    const editId = editItem?._id ?? editItem?.id ?? null;
    const isEditMode = Boolean(editId);

    useEffect(() => {
        if (!open) return;
        if (editItem) {
            setForm({
                name: editItem.name ?? "",
                description: editItem.description ?? "",
                icon: String(editItem.icon || editItem.image || "").trim(),
            });
        } else {
            setForm(emptyForm());
        }
        setErrors(emptyErrors());
        setIconUploading(false);
    }, [open, editItem]);

    const handleClose = () => {
        setForm(emptyForm());
        setErrors(emptyErrors());
        setIconUploading(false);
        onClose();
    };

    const handleFieldChange = (event) => {
        const { name, value } = event.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const handleIconUpload = async (event) => {
        const file = event.target.files?.[0];
        event.target.value = "";
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            toast.error("Please upload an image file only");
            return;
        }

        setIconUploading(true);
        try {
            const result = await uploadMediaService(file);
            setForm((prev) => ({ ...prev, icon: result.fileName }));
            setErrors((prev) => ({ ...prev, icon: "" }));
            toast.success("Icon uploaded successfully");
        } catch {
            toast.error("Icon upload failed. Please try again.");
        } finally {
            setIconUploading(false);
        }
    };

    const handleRemoveIcon = () => {
        setForm((prev) => ({ ...prev, icon: "" }));
    };

    const validate = () => {
        const next = emptyErrors();
        if (!form.name.trim()) next.name = "Name is required";
        if (!form.description.trim()) next.description = "Description is required";
        if (!form.icon) next.icon = "Please upload an icon";
        setErrors(next);
        return !Object.values(next).some(Boolean);
    };

    const handleSubmit = async () => {
        if (!validate()) return;

        const payload = {
            name: form.name.trim(),
            description: form.description.trim(),
            icon: form.icon,
        };

        const response = isEditMode
            ? await updateObjective(editId, payload)
            : await createObjective(payload);

        if (response?.success) {
            onSuccess?.();
            handleClose();
        }
    };

    const isBusy = createLoading || updateLoading || iconUploading;

    return (
        <Dialog open={open} onClose={isBusy ? undefined : handleClose} fullWidth maxWidth="sm">
            <DialogTitle sx={{ fontWeight: 700 }}>
                {isEditMode ? "Edit Campaign Objective" : "Add Campaign Objective"}
            </DialogTitle>
            <DialogContent sx={{ pt: "8px !important" }}>
                <FieldLabel>Upload Icon *</FieldLabel>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={handleIconUpload}
                />
                <Box
                    onClick={() => !isBusy && !form.icon && fileInputRef.current?.click()}
                    sx={{
                        border: "2px dashed #D9D9D9",
                        borderRadius: "12px",
                        p: 3,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 1,
                        cursor: isBusy || form.icon ? "default" : "pointer",
                        bgcolor: "#FAFAFA",
                        opacity: isBusy ? 0.7 : 1,
                        "&:hover":
                            isBusy || form.icon
                                ? {}
                                : {
                                      borderColor: "#FF1572",
                                      bgcolor: "rgba(255, 21, 114, 0.04)",
                                  },
                    }}
                >
                    {iconUploading ? (
                        <CircularProgress size={32} sx={{ color: "#FF1572" }} />
                    ) : (
                        <CloudUploadOutlinedIcon sx={{ fontSize: 40, color: "#FF1572" }} />
                    )}
                    <Typography fontSize={14} fontWeight={600} color="#5E1321">
                        {iconUploading
                            ? "Uploading..."
                            : form.icon
                              ? "Icon uploaded"
                              : "Click to upload icon"}
                    </Typography>
                    <Typography fontSize={12} color="text.secondary">
                        PNG, JPG — only one icon allowed
                    </Typography>
                </Box>

                {errors.icon ? (
                    <Typography fontSize={12} color="error.main" mt={1}>
                        {errors.icon}
                    </Typography>
                ) : null}

                {form.icon ? (
                    <Box
                        sx={{
                            position: "relative",
                            width: 88,
                            height: 88,
                            borderRadius: "10px",
                            overflow: "hidden",
                            border: "1px solid #E0E0E0",
                            mt: 2,
                        }}
                    >
                        <Box
                            component="img"
                            src={getFullS3Url(form.icon)}
                            alt="Objective icon"
                            sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                        <IconButton
                            size="small"
                            aria-label="Remove icon"
                            onClick={handleRemoveIcon}
                            disabled={isBusy}
                            sx={{
                                position: "absolute",
                                top: 2,
                                right: 2,
                                bgcolor: "rgba(255,255,255,0.9)",
                                "&:hover": { bgcolor: "#fff" },
                                p: 0.25,
                            }}
                        >
                            <DeleteOutlineIcon fontSize="small" />
                        </IconButton>
                    </Box>
                ) : null}

                <FieldLabel>Name *</FieldLabel>
                <CustomInput
                    name="name"
                    value={form.name}
                    onChange={handleFieldChange}
                    placeholder="e.g. Brand Awareness"
                    fullWidth
                    backgroundColor="#fff"
                    borderRadius="10px"
                    error={Boolean(errors.name)}
                    helperText={errors.name}
                    sx={inputSx}
                    disabled={isBusy}
                />

                <FieldLabel>Description *</FieldLabel>
                <CustomInput
                    name="description"
                    value={form.description}
                    onChange={handleFieldChange}
                    placeholder="Short description"
                    fullWidth
                    multiline
                    minRows={3}
                    backgroundColor="#fff"
                    borderRadius="10px"
                    error={Boolean(errors.description)}
                    helperText={errors.description}
                    sx={inputSx}
                    disabled={isBusy}
                />
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2 }}>
                <CustomButton
                    variant="text"
                    handlePressBtn={handleClose}
                    btnLabel="Cancel"
                    disabled={isBusy}
                />
                <CustomButton
                    handlePressBtn={handleSubmit}
                    btnLabel="Save"
                    btnBgColor="#FF1572"
                    btnHoverColor="#e01265"
                    borderRadius="10px"
                    loading={createLoading || updateLoading}
                    disabled={isBusy}
                />
            </DialogActions>
        </Dialog>
    );
};

export default AddCampaignObjective;
