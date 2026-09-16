import { Chip } from "@mui/material";
import {
    formatOrderStatusDisplay,
    getOrderStatusChipStyle,
} from "../../utils/orderHelpers";

const OrderStatusChip = ({ status }) => {
    const label = formatOrderStatusDisplay(status);
    const chipStyle = getOrderStatusChipStyle(status);

    if (label === "—") {
        return null;
    }

    return (
        <Chip
            label={label}
            size="small"
            sx={{
                height: 28,
                fontSize: 13,
                fontWeight: 600,
                border: "none",
                "& .MuiChip-label": { px: 1.5, whiteSpace: "nowrap" },
                ...chipStyle,
            }}
        />
    );
};

export default OrderStatusChip;
