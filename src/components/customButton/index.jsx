import { Button, CircularProgress, useTheme } from "@mui/material";

const CustomButton = ({
  btnLabel,
  handlePressBtn,
  btnBgColor,
  btnTextColor,
  btnHoverColor,
  btnTextTransform,
  endIcon,
  textWeight,
  borderColor,
  variant,
  color,
  width,
  height,
  btnTextSize,
  borderRadius,
  isBorder,
  sx,
  startIcon,
  disabled,
  loading,
  btnPadding,
  type = "button",
}) => {
  const theme = useTheme();
  const isVariant = Boolean(variant);

  const resolvedBg = btnBgColor ?? theme.palette.secondary.main;
  const resolvedColor = btnTextColor ?? "#ffffff";
  const resolvedHover =
    btnHoverColor ?? theme.palette.secondary.dark ?? theme.palette.secondary.main;

  const borderFromFlag =
    typeof isBorder === "string"
      ? isBorder
      : isBorder
        ? `1px solid ${borderColor ?? "currentColor"}`
        : undefined;

  return (
    <Button
      type={type}
      sx={{
        ...(borderColor && { borderColor }),
        ...(borderFromFlag !== undefined && { border: borderFromFlag }),
        ...(width && { width }),
        ...(height && { height }),
        fontWeight: textWeight ?? 300,
        borderRadius,
        fontSize: btnTextSize ?? "14px",
        padding: btnPadding ?? "10px 15px",
        textTransform: btnTextTransform ?? "capitalize",
        opacity: disabled ? 0.5 : 1,
        ...(loading && { minHeight: 44 }),
        ...(isVariant
          ? {}
          : {
              backgroundColor: resolvedBg,
              color: resolvedColor,
              "&:hover": {
                backgroundColor: resolvedHover,
                ...(borderColor && { borderColor }),
              },
            }),
        "&.Mui-disabled": {
          color: isVariant ? undefined : btnTextColor ?? resolvedColor,
        },
        ...sx,
      }}
      {...(typeof handlePressBtn === "function" ? { onClick: handlePressBtn } : {})}
      endIcon={endIcon}
      startIcon={startIcon}
      variant={variant}
      color={color}
      disabled={disabled || loading}
    >
      {loading ? (
        <CircularProgress size={22} thickness={4} color="inherit" aria-label="Loading" />
      ) : (
        btnLabel
      )}
    </Button>
  );
};

export default CustomButton;