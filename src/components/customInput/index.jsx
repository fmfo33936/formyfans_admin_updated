import React, { useState } from "react";
import PropTypes from "prop-types";
import { InputAdornment, TextField, IconButton } from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

function CustomInput({
    InputStartIcon,
    InputEndIcon,
    onEndIconClick,
    fullWidth = true,
    readonly,
    inputBgColor,
    borderRadius,
    backgroundColor,
    error,
    helperText,
    color,
    type = "text",
    sx,
    disabled = false,
    InputProps: inputPropsFromParent = {},
    ...props
}) {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === "password";
    const effectiveType =
        isPassword && showPassword && !disabled ? "text" : type;

    let endAdornment;
    if (isPassword && !disabled) {
        endAdornment = (
            <InputAdornment position="end">
                <IconButton
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    edge="end"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    tabIndex={-1}
                    sx={{ padding: "6px", color: "#1F2937" }}
                >
                    {showPassword ? (
                        <VisibilityOff fontSize="small" />
                    ) : (
                        <Visibility fontSize="small" />
                    )}
                </IconButton>
            </InputAdornment>
        );
    } else if (InputEndIcon) {
        endAdornment = (
            <InputAdornment position="end">
                <IconButton
                    edge="end"
                    onClick={onEndIconClick}
                    sx={{ padding: "6px", color: "#1F2937" }}
                >
                    {InputEndIcon}
                </IconButton>
            </InputAdornment>
        );
    } else {
        endAdornment = inputPropsFromParent.endAdornment;
    }

    return (
        <TextField
            fullWidth={fullWidth}
            type={effectiveType}
            disabled={disabled}
            {...props}
            error={error}
            helperText={helperText}
            InputProps={{
                ...inputPropsFromParent,
                readOnly: readonly ?? inputPropsFromParent.readOnly,
                startAdornment:
                    InputStartIcon ? (
                        <InputAdornment position="start">{InputStartIcon}</InputAdornment>
                    ) : (
                        inputPropsFromParent.startAdornment
                    ),
                endAdornment,
            }}
            sx={(theme) => ({
                "& .MuiOutlinedInput-root": {
                    borderRadius: borderRadius || "20px",
                    background: backgroundColor || "rgba(94, 19, 33, 1)",
                    color: color || "#fff",
                    border: "1px solid #E5E7EB",

                    "& fieldset": {
                        border: "none",
                    },
                    "&:hover fieldset": {
                        border: "none",
                    },
                    "&.Mui-focused fieldset": {
                        border: "none",
                    },
                    "&:hover": {
                        borderColor: "#D1D5DB",
                    },
                    "&.Mui-focused": {
                        borderColor: "#FF1572",
                    },
                },

                "& .MuiInputBase-input": {
                    padding: "12px 16px",
                    fontSize: "15px",
                    color: "#1F2937",
                    fontFamily: "Montserrat",

                    "&::placeholder": {
                        color: "#9CA3AF",
                        opacity: 1,
                        fontWeight: 400,
                    },
                },

                "& .MuiFormHelperText-root": {
                    color: "#1F2937",
                },

                ...(typeof sx === "function" ? sx(theme) : sx),
            })}
        />
    );
}

CustomInput.propTypes = {
    InputStartIcon: PropTypes.element,
    InputEndIcon: PropTypes.element,
    onEndIconClick: PropTypes.func,
    fullWidth: PropTypes.bool,
    readonly: PropTypes.bool,
    type: PropTypes.string,
};

export default CustomInput;
