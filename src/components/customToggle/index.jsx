import { Box, CircularProgress, Stack, Switch, Typography } from "@mui/material";
import { alpha, styled } from "@mui/material/styles";

const StyledSwitch = styled(Switch)(({ theme }) => ({
    width: 44,
    height: 26,
    padding: 0,
    "& .MuiSwitch-switchBase": {
        padding: 2,
        "&.Mui-checked": {
            transform: "translateX(18px)",
            color: theme.palette.common.white,
            "& + .MuiSwitch-track": {
                backgroundColor: theme.palette.secondary.main,
                opacity: 1,
            },
        },
    },
    "& .MuiSwitch-thumb": {
        width: 22,
        height: 22,
        boxShadow: "none",
    },
    "& .MuiSwitch-track": {
        borderRadius: 13,
        backgroundColor: alpha(theme.palette.text.primary, 0.25),
        opacity: 1,
    },
}));

export default function CustomToggle({
    checked = false,
    onChange,
    disabled = false,
    activeLabel = "Active",
    inactiveLabel = "Inactive",
    hideLabels = false,
    loading = false,
    inputProps,
    sx,
}) {
    return (
        <Stack
            direction="row"
            alignItems="center"
            spacing={hideLabels ? 0 : 1}
            justifyContent="center"
            sx={sx}
        >
            {loading ? (
                <Box
                    sx={{
                        width: 44,
                        height: 26,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                    role="status"
                    aria-busy="true"
                    aria-label="Updating"
                >
                    <CircularProgress size={22} thickness={4} color="secondary" />
                </Box>
            ) : (
                <StyledSwitch
                    checked={checked}
                    onChange={onChange}
                    disabled={disabled}
                    inputProps={{
                        "aria-label": checked ? activeLabel : inactiveLabel,
                        ...inputProps,
                    }}
                />
            )}
            {!hideLabels ? (
                <Typography
                    variant="body2"
                    fontWeight={600}
                    sx={{
                        color: checked ? "secondary.main" : "text.secondary",
                        whiteSpace: "nowrap",
                    }}
                >
                    {checked ? activeLabel : inactiveLabel}
                </Typography>
            ) : null}
        </Stack>
    );
}
