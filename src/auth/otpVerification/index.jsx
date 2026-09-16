import { Box, Stack, Typography, useTheme } from "@mui/material";
import React, { useEffect, useState } from "react";
import CustomOtp from "../../components/customOtp";
import CustomButton from "../../components/customButton";
import logo from "../../assets/images/logo.png";
import { useLocation, useNavigate } from "react-router-dom";

const OTP_LENGTH = 6;

const OtpVerification = () => {
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const emailFromState = location.state?.email;

  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");

  useEffect(() => {
    if (!emailFromState) {
      navigate("/auth/forgot-password", { replace: true });
    }
  }, [emailFromState, navigate]);

  const handleOtpChange = (value) => {
    setOtp(value);
    if (otpError) setOtpError("");
  };

  const handleVerify = () => {
    if (!emailFromState) return;
    const code = otp.trim();
    if (!code) {
      setOtpError("Enter your OTP");
      return;
    }
    if (code.length < OTP_LENGTH) {
      setOtpError(`Enter all ${OTP_LENGTH} digits`);
      return;
    }
    setOtpError("");

    navigate("/auth/reset-password", {
      state: { email: emailFromState, otp: code },
    });
  };

  if (!emailFromState) {
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

          <Stack spacing={2} width="100%" alignItems="center">
            <Typography
              variant="h6"
              fontWeight={700}
              color={theme.palette.secondary.main}
              textAlign="center"
            >
              OTP Verification
            </Typography>
            <Typography variant="body1" textAlign="center" color="text.secondary">
              Enter the OTP sent to{" "}
              <Box component="span" fontWeight={600} color="text.primary">
                {emailFromState}
              </Box>
            </Typography>

            <Box display="flex" justifyContent="center" width="100%">
              <CustomOtp value={otp} onChange={handleOtpChange} numInputs={OTP_LENGTH} />
            </Box>

            {otpError ? (
              <Typography variant="caption" color="error" textAlign="center">
                {otpError}
              </Typography>
            ) : null}

            <CustomButton
              type="button"
              variant="contained"
              color="primary"
              btnLabel="Verify"
              borderRadius="14px"
              textWeight={600}
              btnTextSize="15px"
              btnPadding="12px 24px"
              handlePressBtn={handleVerify}
            />
          </Stack>
        </Stack>
      </Box>
    </Box>
  );
};

export default OtpVerification;
