import React, { useState } from "react";
import { Box, Stack, Typography, useTheme } from "@mui/material";
import { Link, useLocation, useNavigate } from "react-router-dom";
import CustomInput from "../../components/customInput";
import CustomButton from "../../components/customButton";
import logo from "../../assets/images/logo.png";
import { useLogin } from "../../hook/login";
import useUserStore from "../../zustand/userUserStore";
import { toast } from "react-toastify";
const Login = () => {
  const theme = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loading } = useLogin();
  const setAuthData = useUserStore((state) => state.setAuthData);

  const handleLogin = async () => {
    if (!email.trim()) {
      toast.error("Please enter your email");
      return;
    }
    if (!password) {
      toast.error("Please enter your password");
      return;
    }

    const payload = {
      email: email.trim(),
      password,
    };

    const response = await login(payload, "Login successful");
    if (!response?.success) return;

    const authData = response?.data || {};
    const token =
      authData?.token || authData?.accessToken || authData?.authToken || null;
    const user = authData?.user || authData?.admin || authData || null;

    if (token) {
      localStorage.setItem("token", token);
    }

    setAuthData({ user, token });
    const redirectTo =
      typeof location.state?.from === "string" &&
      location.state.from.startsWith("/app")
        ? location.state.from
        : "/app/admin-panel";
    navigate(redirectTo, { replace: true });
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
        component="form"
        onSubmit={(e) => {
          e.preventDefault();
          handleLogin();
        }}
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
              Email
            </Typography>
            <CustomInput
              //   label="Email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              backgroundColor="#ffffff"
              color="#1F2937"
            />
            <Typography
              variant="h6"
              fontWeight={700}
              color={theme.palette.secondary.main}
            >
              Password
            </Typography>
            <CustomInput
              name="password"
              type="password"
              autoComplete="current-password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              backgroundColor="#ffffff"
              color="#1F2937"
            />

            <Box display="flex" justifyContent="flex-end" width="100%">
              <Link
                to="/auth/forgot-password"
                style={{
                  textDecoration: "none",
                  color: theme.palette.secondary.main,
                  pointerEvents: "auto",
                }}
              >
                <Typography variant="body2" fontWeight={500} fontSize={12}>
                  Forgot Password?
                </Typography>
              </Link>
            </Box>

            <Box pt={0.5}>
              <CustomButton
                type="submit"
                variant="contained"
                width="100%"
                borderRadius="14px"
                textWeight={600}
                btnTextSize="15px"
                btnPadding="12px 15px"
                disabled={loading}
                loading={loading}
                btnLabel="Login"
                sx={{ minHeight: 48 }}
              />
            </Box>
          </Stack>
        </Stack>
      </Box>
    </Box>
  );
};

export default Login;
