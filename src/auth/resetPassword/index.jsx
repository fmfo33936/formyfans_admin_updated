import React, { useEffect, useState } from "react";
import { Box, Stack, Typography, useTheme } from "@mui/material";
import CustomInput from "../../components/customInput";
import CustomButton from "../../components/customButton";
import logo from "../../assets/images/logo.png";
import { useLocation, useNavigate } from "react-router-dom";
import { useResetPassword } from "../../hook/resetPassword";

const ResetPassword = () => {
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const emailFromState = location.state?.email;
  const otpFromState = location.state?.otp;

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { submitReset, loading } = useResetPassword();

  useEffect(() => {
    if (!emailFromState) {
      navigate("/auth/forgot-password", { replace: true });
      return;
    }
    if (!otpFromState) {
      navigate("/auth/otp-verification", {
        replace: true,
        state: { email: emailFromState },
      });
    }
  }, [emailFromState, otpFromState, navigate]);

  const passwordsMatch =
    newPassword &&
    confirmPassword &&
    newPassword === confirmPassword;

  const handleReset = async () => {
    if (!emailFromState || !otpFromState || !passwordsMatch) return;

    const response = await submitReset(
      {
        email: emailFromState,
        otp: String(otpFromState).trim(),
        newPassword: newPassword.trim(),
      },
      "Password reset successfully"
    );
    if (!response?.success) return;

    navigate("/auth/login", { replace: true });
  };

  if (!emailFromState || !otpFromState) {
    return null;
  }

  return (
    <Box
      component="main"
      sx={{
        minHeight: "100dvh",
        width: "100%",
        maxWidth: "100vw",
        boxSizing: "border-box",
        overflowX: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: theme.palette.grey[100],
        px: 2,
        py: 3,
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: 450,
          mx: "auto",
          py: { xs: 3, sm: 4 },
          px: { xs: 2.5, sm: 3.5 },
          bgcolor: theme.palette.background.paper,
          borderRadius: "28px",
          boxShadow: "0 12px 40px rgba(0, 0, 0, 0.08)",
        }}
      >
        <Stack spacing={2.5} alignItems="center" width="100%">
          <Box
            component="img"
            src={logo}
            alt="Logo"
            sx={{
              width: { xs: 80, sm: 95 },
              height: "auto",
              objectFit: "contain",
              display: "block",
            }}
          />

          <Stack spacing={2} width="100%">
            <Typography
              variant="h6"
              fontWeight={700}
              color={theme.palette.secondary.main}
            >
              Reset Password
            </Typography>

            <Typography
              variant="h6"
              fontWeight={700}
              color={theme.palette.secondary.main}
            >
              New Password
            </Typography>
            <CustomInput
              name="newPassword"
              type="password"
              autoComplete="new-password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              backgroundColor="#ffffff"
              color="#1F2937"
            />
            <Typography
              variant="h6"
              fontWeight={700}
              color={theme.palette.secondary.main}
            >
              Confirm Password
            </Typography>
            <CustomInput
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              backgroundColor="#ffffff"
              color="#1F2937"
            />

            {newPassword &&
              confirmPassword &&
              newPassword !== confirmPassword && (
                <Typography variant="body2" color="error">
                  Passwords do not match
                </Typography>
              )}

            <Box pt={0.5}>
              <CustomButton
                type="button"
                variant="contained"
                btnLabel="Reset Password"
                width="100%"
                borderRadius="14px"
                textWeight={600}
                btnTextSize="15px"
                btnPadding="12px 15px"
                loading={loading}
                handlePressBtn={handleReset}
              />
            </Box>
          </Stack>
        </Stack>
      </Box>
    </Box>
  );
};

export default ResetPassword;
