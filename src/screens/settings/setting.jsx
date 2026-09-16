import {
  Avatar,
  Box,
  CircularProgress,
  IconButton,
  Stack,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import CameraAltOutlinedIcon from "@mui/icons-material/CameraAltOutlined";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { getAdminSettings } from "../../api/modules/adminSettings";
import CustomButton from "../../components/customButton";
import CustomInput from "../../components/customInput";
import Header from "../../components/header";
import Sidebar from "../../components/sidebar";
import { adminMenuItems } from "../../constants/adminMenuItems";
import { useChangePassword } from "../../hook/change-password";
import {
  getAvatarInitials,
  useProfile,
} from "../../hook/profile";
import { uploadMediaService } from "../../utils/helper";
import { getFullS3Url } from "../../utils/s3Helper";

const emptyPasswordErrors = {
  currentPassword: "",
  newPassword: "",
  confirmNewPassword: "",
};

const emptyPasswordForm = {
  currentPassword: "",
  newPassword: "",
  confirmNewPassword: "",
};

const extractPayoutPercentage = (payload) => {
  const candidates = [
    payload,
    payload?.data,
    payload?.settings,
    payload?.data?.data,
  ];

  for (const source of candidates) {
    if (!source || typeof source !== "object" || Array.isArray(source)) {
      continue;
    }

    const value =
      source.dealsPayoutPercentage ??
      source.percentage ??
      source.payOutPercentage ??
      source.payoutPercentage ??
      source.payoutFee ??
      source.platformFee;

    if (value !== null && value !== undefined && value !== "") {
      return String(value);
    }
  }

  return "";
};

const extractFanbugPayoutPercentage = (payload) => {
  const candidates = [
    payload,
    payload?.data,
    payload?.settings,
    payload?.data?.data,
  ];

  for (const source of candidates) {
    if (!source || typeof source !== "object" || Array.isArray(source)) {
      continue;
    }

    const value = source.fanbugPayoutPercentage;
    if (value !== null && value !== undefined && value !== "") {
      return String(value);
    }
  }

  return "";
};

const simpleInputSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "8px",
    border: "1px solid #D9D9D9",
    backgroundColor: "#FFFFFF",
    "&:hover": {
      borderColor: "#BDBDBD",
    },
    "&.Mui-focused": {
      borderColor: "#FF1572",
    },
    "&.Mui-error": {
      borderColor: "error.main",
    },
    "&.Mui-error:hover": {
      borderColor: "error.main",
    },
    "&.Mui-error.Mui-focused": {
      borderColor: "error.main",
    },
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

const Setting = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [username, setUsername] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [imageValue, setImageValue] = useState("");
  const [imageUploading, setImageUploading] = useState(false);
  const [payOutPercentage, setPayOutPercentage] = useState("");
  const [fanbugPayoutPercentage, setFanbugPayoutPercentage] = useState("");
  const [passwordForm, setPasswordForm] = useState(emptyPasswordForm);
  const [passwordErrors, setPasswordErrors] = useState(emptyPasswordErrors);
  const fileInputRef = useRef(null);

  const {
    profile,
    loading: profileLoading,
    updateLoading,
    fetchProfile,
    saveProfile,
  } = useProfile();
  const { changePassword, loading: changePasswordLoading } = useChangePassword();

  useEffect(() => {
    fetchProfile({ force: true });
  }, [fetchProfile]);

  useEffect(() => {
    if (!profile) return;
    setUsername(profile.username || "");
    setImageValue(profile.image || profile.avatar || profile.profileImage || "");
  }, [profile]);

  useEffect(() => {
    let cancelled = false;

    const loadAdminSettings = async () => {
      try {
        const response = await getAdminSettings();
        const isOk = response?.status >= 200 && response?.status < 300;
        if (!isOk || cancelled) return;

        const percentage = extractPayoutPercentage(response?.data);
        const fanbugPercentage = extractFanbugPayoutPercentage(response?.data);

        if (percentage !== "") setPayOutPercentage(percentage);
        if (fanbugPercentage !== "") setFanbugPayoutPercentage(fanbugPercentage);
      } catch (error) {
        console.error(error);
      }
    };

    loadAdminSettings();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleToggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const menuItems = [
    ...adminMenuItems,
    { label: "Settings", path: "/app/settings" },
  ];

  const profileEmail = profile?.email || "—";
  const previewImage = imageValue ? getFullS3Url(imageValue) : "";
  const avatarInitials = getAvatarInitials(profile || { username });
  const isProfileBusy = updateLoading || imageUploading;

  const handleImagePick = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    setImageUploading(true);
    try {
      const uploaded = await uploadMediaService(file, "media");
      const nextImage = uploaded?.secure_url || uploaded?.fileName || "";
      if (!nextImage) {
        toast.error("Image upload failed");
        return;
      }
      setImageValue(nextImage);
      toast.success("Image uploaded");
    } catch (error) {
      toast.error(error?.message || "Image upload failed");
    } finally {
      setImageUploading(false);
    }
  };

  const handleSaveProfile = async () => {
    const trimmed = username.trim();
    if (!trimmed) {
      setUsernameError("Username is required");
      return;
    }
    setUsernameError("");
    await saveProfile({
      username: trimmed,
      image: imageValue || undefined,
    });
  };

  const handlePasswordInputChange = (event) => {
    const { name, value } = event.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));
    setPasswordErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleChangePassword = async () => {
    const { currentPassword, newPassword, confirmNewPassword } = passwordForm;
    const nextErrors = { ...emptyPasswordErrors };

    if (!currentPassword.trim()) {
      nextErrors.currentPassword = "Current password is required";
    }
    if (!newPassword.trim()) {
      nextErrors.newPassword = "New password is required";
    }
    if (!confirmNewPassword.trim()) {
      nextErrors.confirmNewPassword = "Please confirm your new password";
    }
    if (
      newPassword.trim() &&
      confirmNewPassword.trim() &&
      newPassword !== confirmNewPassword
    ) {
      nextErrors.confirmNewPassword = "Passwords do not match";
    }

    if (Object.values(nextErrors).some(Boolean)) {
      setPasswordErrors(nextErrors);
      return;
    }

    setPasswordErrors(emptyPasswordErrors);
    const response = await changePassword({
      currentPassword,
      newPassword,
      confirmNewPassword,
    });

    if (response?.success) {
      setPasswordForm(emptyPasswordForm);
    }
  };

  return (
    <Box sx={{ overflowX: "hidden", maxWidth: "100%" }}>
      <Header sidebarCollapsed={collapsed} />
      <Sidebar
        menuItems={menuItems}
        activeItem="Settings"
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
        <Typography
          fontSize={{ xs: 24, md: 28 }}
          fontWeight={700}
          color="text.primary"
          mb={2}
        >
          Settings
        </Typography>

        <Tabs
          value={activeTab}
          onChange={(_e, value) => setActiveTab(value)}
          sx={{
            mb: 3,
            minHeight: 42,
            "& .MuiTab-root": {
              textTransform: "none",
              fontWeight: 600,
              minHeight: 42,
              color: "#666",
            },
            "& .Mui-selected": { color: "#5E1321 !important" },
            "& .MuiTabs-indicator": { backgroundColor: "#5E1321" },
          }}
        >
          <Tab label="Profile" />
          <Tab label="Change Password" />
        </Tabs>

        <Box
          sx={{
            width: "100%",
            maxWidth: 720,
            p: 3,
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 2,
            backgroundColor: "background.paper",
          }}
        >
          {activeTab === 0 && (
            <>
              {profileLoading ? (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    py: 6,
                  }}
                >
                  <CircularProgress sx={{ color: "#5E1321" }} />
                </Box>
              ) : (
                <Stack spacing={2}>
                  <Typography fontSize={16} fontWeight={600} color="text.primary">
                    Email
                  </Typography>
                  <CustomInput
                    value={profileEmail}
                    fullWidth
                    disabled
                    sx={simpleInputSx}
                  />

                  <Typography fontSize={16} fontWeight={600} color="text.primary">
                    Username
                  </Typography>
                  <CustomInput
                    name="username"
                    value={username}
                    onChange={(e) => {
                      setUsername(e.target.value);
                      setUsernameError("");
                    }}
                    placeholder="Enter username"
                    fullWidth
                    error={Boolean(usernameError)}
                    helperText={usernameError || undefined}
                    sx={simpleInputSx}
                    disabled={isProfileBusy}
                  />

                  <Typography fontSize={16} fontWeight={600} color="text.primary">
                    Pay Out Percentage
                  </Typography>
                  <CustomInput
                    placeholder="Pay Out Percentage"
                    name="payOutPercentage"
                    type="text"
                    value={payOutPercentage}
                    onChange={(e) => setPayOutPercentage(e.target.value)}
                    sx={simpleInputSx}
                  />

                  <Typography fontSize={16} fontWeight={600} color="text.primary">
                    Fanbug Payout Percentage
                  </Typography>
                  <CustomInput
                    placeholder="Fanbug Payout Percentage"
                    name="fanbugPayoutPercentage"
                    type="text"
                    value={fanbugPayoutPercentage}
                    onChange={(e) => setFanbugPayoutPercentage(e.target.value)}
                    sx={simpleInputSx}
                  />

                  <Box display="flex" justifyContent="flex-end" pt={1}>
                    <CustomButton
                      variant="contained"
                      handlePressBtn={handleSaveProfile}
                      btnLabel="Save Profile"
                      btnBgColor="#FF1572"
                      btnHoverColor="#e01265"
                      borderRadius="10px"
                      loading={updateLoading}
                      disabled={isProfileBusy}
                    />
                  </Box>
                </Stack>
              )}
            </>
          )}

          {activeTab === 1 && (
            <>
              <Typography variant="h6" fontWeight={600} mb={2}>
                Change Password
              </Typography>
              <Stack spacing={2}>
                <Typography fontSize={16} fontWeight={600} color="text.primary">
                  Current Password
                </Typography>
                <CustomInput
                  placeholder="Current Password"
                  name="currentPassword"
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={handlePasswordInputChange}
                  fullWidth
                  error={Boolean(passwordErrors.currentPassword)}
                  helperText={passwordErrors.currentPassword || undefined}
                  sx={simpleInputSx}
                  disabled={changePasswordLoading}
                />

                <Typography fontSize={16} fontWeight={600} color="text.primary">
                  New Password
                </Typography>
                <CustomInput
                  placeholder="New Password"
                  name="newPassword"
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={handlePasswordInputChange}
                  fullWidth
                  error={Boolean(passwordErrors.newPassword)}
                  helperText={passwordErrors.newPassword || undefined}
                  sx={simpleInputSx}
                  disabled={changePasswordLoading}
                />

                <Typography fontSize={16} fontWeight={600} color="text.primary">
                  Confirm New Password
                </Typography>
                <CustomInput
                  placeholder="Confirm New Password"
                  name="confirmNewPassword"
                  type="password"
                  value={passwordForm.confirmNewPassword}
                  onChange={handlePasswordInputChange}
                  fullWidth
                  error={Boolean(passwordErrors.confirmNewPassword)}
                  helperText={passwordErrors.confirmNewPassword || undefined}
                  sx={simpleInputSx}
                  disabled={changePasswordLoading}
                />

                <Box display="flex" justifyContent="flex-end" pt={1}>
                  <CustomButton
                    variant="contained"
                    handlePressBtn={handleChangePassword}
                    btnLabel="Update Password"
                    btnBgColor="#FF1572"
                    btnHoverColor="#e01265"
                    borderRadius="10px"
                    loading={changePasswordLoading}
                    disabled={changePasswordLoading}
                  />
                </Box>
              </Stack>
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default Setting;
