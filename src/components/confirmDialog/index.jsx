import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Typography,
} from "@mui/material";
import CustomButton from "../customButton";

const ConfirmDialog = ({
    open,
    title = "Confirm",
    message = "Are you sure?",
    confirmLabel = "Yes",
    cancelLabel = "Cancel",
    loading = false,
    onConfirm,
    onClose,
}) => {
    return (
        <Dialog open={open} onClose={loading ? undefined : onClose} fullWidth maxWidth="xs">
            <DialogTitle sx={{ fontWeight: 700 }}>{title}</DialogTitle>
            <DialogContent>
                <Typography fontSize={14} color="text.secondary">
                    {message}
                </Typography>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2 }}>
                <CustomButton
                    variant="text"
                    handlePressBtn={onClose}
                    btnLabel={cancelLabel}
                    disabled={loading}
                />
                <CustomButton
                    handlePressBtn={onConfirm}
                    btnLabel={confirmLabel}
                    btnBgColor="#FF1572"
                    btnHoverColor="#e01265"
                    borderRadius="10px"
                    loading={loading}
                    disabled={loading}
                />
            </DialogActions>
        </Dialog>
    );
};

export default ConfirmDialog;
