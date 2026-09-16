import {
  Box,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  MenuItem,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import CustomInput from "../../../components/customInput";
import CustomButton from "../../../components/customButton";
import { useCreators } from "../../../hook/creators";

export const INTERESTS = [
  { label: "Skin Care", value: "skin_care" },
  { label: "Beauty", value: "beauty" },
  { label: "Fashion", value: "fashion" },
  { label: "Fitness", value: "fitness" },
  { label: "Wellness", value: "wellness" },
  { label: "Travel", value: "travel" },
  { label: "Lifestyle", value: "lifestyle" },
  { label: "Food", value: "food" },
  { label: "Tech", value: "tech" },
  { label: "Gaming", value: "gaming" },
  { label: "Parenting", value: "parenting" },
  { label: "Luxury", value: "luxury" },
  { label: "Home Decor", value: "home_decor" },
  { label: "Photography", value: "photography" },
  { label: "Music", value: "music" },
  { label: "Sustainability", value: "sustainability" },
];

const inputSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "10px",
    border: "1px solid #D9D9D9",
    backgroundColor: "#FFFFFF",
    "&:hover": { borderColor: "#BDBDBD" },
    "&.Mui-focused": { borderColor: "#FF1572" },
    "&.Mui-error": { borderColor: "error.main" },
  },
  "& .MuiInputBase-input": { padding: "11px 14px", fontSize: "14px" },
  "& .MuiFormHelperText-root.Mui-error": { marginLeft: 0, color: "error.main" },
};

const emptyForm = {
  firstName: "",
  lastName: "",
  email: "",
  username: "",
  password: "",
  dateOfBirth: "",
  gender: "",
  interests: [],
  isAdult: false,
  freeMonths: 0,
};

const CreateCreator = ({ open, onClose, onSuccess, editItem = null }) => {
  const { createCreator, updateCreator, loading } = useCreators();
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const editId = editItem?._id ?? editItem?.id ?? null;
  const isEditMode = Boolean(editId);

  useEffect(() => {
    if (!open) return;
    const nameParts = (editItem?.name ?? "").split(" ");
    setForm({
      ...emptyForm,
      firstName: editItem?.firstName ?? nameParts[0] ?? "",
      lastName: editItem?.lastName ?? nameParts.slice(1).join(" "),
      email: editItem?.email === "—" ? "" : editItem?.email ?? "",
      username: editItem?.username ?? "",
      dateOfBirth: editItem?.dateOfBirth?.slice(0, 10) ?? "",
      gender: editItem?.gender ?? "",
      interests: editItem?.interests ?? [],
      isAdult: editItem?.isAdult ?? false,
      freeMonths: editItem?.freeMonths ?? 0,
    });
    setErrors({});
  }, [open, editItem]);

  const handleClose = () => {
    setForm({ ...emptyForm, interests: [] });
    setErrors({});
    onClose();
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: "" }));
  };

  const toggleInterest = (value) => {
    setForm((current) => ({
      ...current,
      interests: current.interests.includes(value)
        ? current.interests.filter((item) => item !== value)
        : [...current.interests, value],
    }));
    setErrors((current) => ({ ...current, interests: "" }));
  };

  const handleSubmit = async () => {
    const nextErrors = {};
    if (!form.firstName.trim()) nextErrors.firstName = "First name is required";
    if (!form.lastName.trim()) nextErrors.lastName = "Last name is required";
    if (!form.email.trim()) nextErrors.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) nextErrors.email = "Enter a valid email";
    if (!form.username.trim()) nextErrors.username = "Username is required";
    if (!isEditMode && !form.password) nextErrors.password = "Password is required";
    if (!form.dateOfBirth) nextErrors.dateOfBirth = "Date of birth is required";
    if (!form.gender) nextErrors.gender = "Gender is required";
    if (!form.interests.length) nextErrors.interests = "Select at least one interest";
    if (!form.isAdult) nextErrors.isAdult = "Creator must confirm they are 18 or older";
    if (Number(form.freeMonths) < 0 || Number(form.freeMonths) > 12) {
      nextErrors.freeMonths = "Free months must be between 0 and 12";
    }
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }

    const payload = {
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      email: form.email.trim(),
      username: form.username.trim(),
      dateOfBirth: form.dateOfBirth,
      gender: form.gender,
      interests: form.interests,
      isAdult: form.isAdult,
      freeMonths: Number(form.freeMonths),
      ...(form.password ? { password: form.password } : {}),
    };
    const response = isEditMode
      ? await updateCreator(editId, payload)
      : await createCreator(payload);
    if (response?.success) {
      onSuccess?.();
      handleClose();
    }
  };

  const field = (name, label, placeholder, type = "text") => (
    <Box>
      <Typography fontSize={14} fontWeight={600} color="text.primary" mb={0.5}>
        {label}
      </Typography>
      <CustomInput
        name={name}
        type={type}
        value={form[name]}
        onChange={handleChange}
        placeholder={placeholder}
        backgroundColor="#fff"
        borderRadius="10px"
        error={Boolean(errors[name])}
        helperText={errors[name]}
        sx={inputSx}
        disabled={loading}
      />
    </Box>
  );

  return (
    <Dialog open={open} onClose={loading ? undefined : handleClose} fullWidth maxWidth="md">
      <DialogTitle sx={{ fontWeight: 700 }}>
        {isEditMode ? "Edit Creator" : "Add Creator"}
      </DialogTitle>
      <DialogContent sx={{ pt: "8px !important" }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
            gap: 2,
            mt: 1,
          }}
        >
          {field("firstName", "First Name *", "e.g. john")}
          {field("lastName", "Last Name *", "e.g. doe")}
          {field("email", "Email *", "e.g. johndoe@example.com", "email")}
          {field("username", "Username *", "e.g. johndoe")}
          {field(
            "password",
            isEditMode ? "Password (optional)" : "Password *",
            "Enter password",
            "password",
          )}
          {field("dateOfBirth", "Date of Birth *", "", "date")}
          <Box>
            <Typography fontSize={14} fontWeight={600} color="text.primary" mb={0.5}>
              Free Trial (Months)
            </Typography>
            <CustomInput
              name="freeMonths"
              type="number"
              value={form.freeMonths}
              onChange={(event) => {
                const value = event.target.value;
                if (value === "" || (Number(value) >= 0 && Number(value) <= 12)) {
                  handleChange(event);
                }
              }}
              inputProps={{ min: 0, max: 12, step: 1 }}
              placeholder="0 to 12"
              backgroundColor="#fff"
              borderRadius="10px"
              error={Boolean(errors.freeMonths)}
              helperText={errors.freeMonths || "Maximum 12 months"}
              sx={inputSx}
              disabled={loading}
            />
          </Box>
          <Box>
            <Typography fontSize={14} fontWeight={600} color="text.primary" mb={0.5}>
              Gender *
            </Typography>
            <CustomInput
              select
              name="gender"
              value={form.gender}
              onChange={handleChange}
              displayEmpty
              backgroundColor="#fff"
              borderRadius="10px"
              error={Boolean(errors.gender)}
              helperText={errors.gender}
              sx={inputSx}
              disabled={loading}
            >
              <MenuItem value="" disabled>
                Select gender
              </MenuItem>
              <MenuItem value="male">Male</MenuItem>
              <MenuItem value="female">Female</MenuItem>
              <MenuItem value="prefer_not_to_say">Prefer not to say</MenuItem>
            </CustomInput>
          </Box>
          <Box sx={{ gridColumn: { xs: "auto", sm: "1 / -1" } }}>
            <Typography fontSize={14} fontWeight={600} color="text.primary" mb={0.5}>
              Interests *
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75 }}>
              {INTERESTS.map((interest) => {
                const selected = form.interests.includes(interest.value);
                return (
                  <CustomButton
                    key={interest.value}
                    btnLabel={interest.label}
                    handlePressBtn={() => toggleInterest(interest.value)}
                    btnBgColor={selected ? "#FF1572" : "#fff"}
                    btnTextColor={selected ? "#fff" : "#FF1572"}
                    borderColor="#FF1572"
                    isBorder
                    btnPadding="5px 10px"
                    borderRadius="16px"
                    disabled={loading}
                  />
                );
              })}
            </Box>
            {errors.interests && (
              <Typography color="error" fontSize={12} mt={0.5}>
                {errors.interests}
              </Typography>
            )}
          </Box>
          <Box sx={{ gridColumn: { xs: "auto", sm: "1 / -1" } }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={form.isAdult}
                  onChange={(event) => {
                    setForm((current) => ({
                      ...current,
                      isAdult: event.target.checked,
                    }));
                    setErrors((current) => ({ ...current, isAdult: "" }));
                  }}
                  sx={{
                    color: "#FF1572",
                    "&.Mui-checked": { color: "#FF1572" },
                  }}
                  disabled={loading}
                />
              }
              label="This creator confirms they are 18 years or older."
            />
            {errors.isAdult && (
              <Typography color="error" fontSize={12}>
                {errors.isAdult}
              </Typography>
            )}
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <CustomButton
          variant="text"
          handlePressBtn={handleClose}
          btnLabel="Cancel"
          disabled={loading}
        />
        <CustomButton
          handlePressBtn={handleSubmit}
          btnLabel={isEditMode ? "Update Creator" : "Create Creator"}
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

export default CreateCreator;
