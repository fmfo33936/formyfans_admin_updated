import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import CustomInput from "../../../components/customInput";
import CustomButton from "../../../components/customButton";
import { useCampaignCategories } from "../../../hook/campaignCategory";

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

const AddCampaignCategory = ({ open, onClose, onSuccess, editItem = null }) => {
  const { createCategory, updateCategory, createLoading, updateLoading } =
    useCampaignCategories();
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const editId = editItem?._id ?? editItem?.id ?? null;
  const isEditMode = Boolean(editId);
  const isBusy = createLoading || updateLoading;

  useEffect(() => {
    if (!open) return;
    setName(editItem?.name ?? "");
    setError("");
  }, [open, editItem]);

  const handleClose = () => {
    setName("");
    setError("");
    onClose();
  };

  const handleSubmit = async () => {
    const trimmed = name.trim();
    if (!trimmed) {
      setError("Name is required");
      return;
    }

    const response = isEditMode
      ? await updateCategory(editId, { name: trimmed })
      : await createCategory({ name: trimmed });

    if (response?.success) {
      onSuccess?.();
      handleClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={isBusy ? undefined : handleClose}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle sx={{ fontWeight: 700 }}>
        {isEditMode ? "Edit Campaign Category" : "Add Campaign Category"}
      </DialogTitle>
      <DialogContent sx={{ pt: "8px !important" }}>
        <Typography
          fontSize={14}
          fontWeight={600}
          color="text.primary"
          mt={1}
          mb={0.5}
        >
          Name *
        </Typography>
        <CustomInput
          name="name"
          value={name}
          onChange={(event) => {
            setName(event.target.value);
            setError("");
          }}
          placeholder="e.g. Beauty & cosmetics"
          fullWidth
          backgroundColor="#fff"
          borderRadius="10px"
          error={Boolean(error)}
          helperText={error}
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
          loading={isBusy}
          disabled={isBusy}
        />
      </DialogActions>
    </Dialog>
  );
};

export default AddCampaignCategory;
