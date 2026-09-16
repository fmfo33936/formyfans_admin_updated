import React, { useState } from "react";
import { Box, Stack, Typography, useTheme } from "@mui/material";
import CustomInput from "../../components/customInput";
import CustomButton from "../../components/customButton";
import logo from "../../assets/images/logo.png";
import { useNavigate } from "react-router-dom";
import { useForgotPassword } from "../../hook/forgotPassword";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validateEmail = (value) => {
  const trimmed = value.trim();
  if (!trimmed) return "Email is required";
  if (!EMAIL_REGEX.test(trimmed)) return "Enter a valid email address";
  return "";
};

const ForgotPassword = () => {
  const theme = useTheme();
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const navigate = useNavigate();
  const { sendResetLink, loading } = useForgotPassword();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (emailError) setEmailError("");
  };

  const handleSendResetLink = async () => {
    const trimmed = email.trim();
    const err = validateEmail(trimmed);
    if (err) {
      setEmailError(err);
      return;
    }
    setEmailError("");

    const response = await sendResetLink(
      { email: trimmed },
      "Reset instructions sent to your email"
    );
    if (!response?.success) return;

    navigate("/auth/otp-verification", { state: { email: trimmed } });
  };

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
              Forgot Password
            </Typography>

            <Typography
              variant="h6"
              fontWeight={700}
              color={theme.palette.secondary.main}
            >
              Email
            </Typography>
            <CustomInput
              name="email"
              type="email"
              autoComplete="email"
              placeholder="Enter your email"
              value={email}
              onChange={handleEmailChange}
              error={Boolean(emailError)}
              helperText={emailError || undefined}
              backgroundColor="#ffffff"
              color="#1F2937"
            />

            <Box pt={0.5}>
              <CustomButton
                type="button"
                variant="contained"
                btnLabel="Send Reset Link"
                width="100%"
                borderRadius="14px"
                textWeight={600}
                btnTextSize="15px"
                btnPadding="12px 15px"
                loading={loading}
                handlePressBtn={handleSendResetLink}
              />
            </Box>
          </Stack>
        </Stack>
      </Box>
    </Box>
  );
};

export default ForgotPassword;