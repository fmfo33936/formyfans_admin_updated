import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { APP_LAYOUT, AUTH_LAYOUT } from "./routes";
import RequireAuth from "./layouts/RequireAuth";
import GuestOnly from "./layouts/GuestOnly";
import { isAuthenticated } from "./utils/auth";

const theme = createTheme({
  palette: {
    primary: {
      main: "#FF1572",
    },
    secondary: {
      main: "#5E1321",
    },
    background: {
      default: "#f5f5f5",
      paper: "#ffffff",
    },
  },
  typography: {
    fontFamily: '"Montserrat", "Helvetica", "Arial", sans-serif',
  },
});

const RootRedirect = () => (
  <Navigate
    to={isAuthenticated() ? "/app/admin-panel" : "/auth/login"}
    replace
  />
);

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Routes>
          <Route path="/" element={<RootRedirect />} />

          <Route
            path="/dashboard"
            element={
              <RequireAuth>
                <Navigate to="/app/admin-panel" replace />
              </RequireAuth>
            }
          />

          {AUTH_LAYOUT.map((route) => (
            <Route
              key={route.id}
              path={route.path}
              element={<GuestOnly>{route.component}</GuestOnly>}
            />
          ))}

          {APP_LAYOUT.map((route) => (
            <Route
              key={route.id}
              path={route.path}
              element={<RequireAuth>{route.component}</RequireAuth>}
            />
          ))}

          <Route path="*" element={<RootRedirect />} />
        </Routes>
        <ToastContainer position="top-right" autoClose={3000} />
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
