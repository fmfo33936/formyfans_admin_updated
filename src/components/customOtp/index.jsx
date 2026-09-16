import { Box, useTheme } from "@mui/material";
import OtpInput from "react-otp-input";

function CustomOtpInput({
  value,
  onChange,
  numInputs = 6,
  shouldAutoFocus = true,
  inputType = "tel",
  separatorWidth = { xs: 6, sm: 10 },
  inputWidth = 44,
  inputHeight = 48,
  borderRadius = "12px",
  fontSize = "18px",
}) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        py: 1,
      }}
    >
      <OtpInput
        value={value}
        onChange={onChange}
        numInputs={numInputs}
        shouldAutoFocus={shouldAutoFocus}
        inputType={inputType}
        renderSeparator={<Box sx={{ width: separatorWidth }} />}
        renderInput={(props) => (
          <input
            {...props}
            style={{
              width: `${inputWidth}px`,
              height: `${inputHeight}px`,
              borderRadius,
              border: `1px solid ${theme.palette.grey[300]}`,
              outline: "none",
              textAlign: "center",
              fontSize,
              fontWeight: 600,
              fontFamily: '"Poppins", sans-serif',
              color: theme.palette.text.primary,
              background: theme.palette.background.paper,
              transition: "border-color 0.2s, box-shadow 0.2s",
            }}
            onFocus={(e) => {
              e.target.style.borderColor = theme.palette.secondary.main;
              e.target.style.boxShadow = `0 0 0 3px ${theme.palette.secondary.main}22`;
            }}
            onBlur={(e) => {
              e.target.style.borderColor = theme.palette.grey[300];
              e.target.style.boxShadow = "none";
            }}
          />
        )}
      />
    </Box>
  );
}

export default CustomOtpInput;