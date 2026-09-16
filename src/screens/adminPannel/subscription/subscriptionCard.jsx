import { Box, Typography } from "@mui/material";
import CustomButton from "../../../components/customButton";

const SubscriptionCard = ({ packageName, price, description, onUpdate }) => {
  return (
    <Box
      sx={{
        backgroundColor: "background.paper",
        borderRadius: "12px",
        padding: "20px",
        paddingTop: "30px",
        boxShadow: (theme) => theme.shadows[2],
        border: "1px solid",
        borderColor: "divider",
        height: "100%",
        minHeight: "260px",
      }}
    >
      <Typography fontSize={20} fontWeight={700} color="text.primary" mb={1}>
        {packageName}
      </Typography>
      <Box mt={2}>
        <Typography fontSize={24} fontWeight={700} color="primary.main" mb={2}>
          {price}
        </Typography>
      </Box>
      <Box mt={3}>
        <Typography
          fontSize={14}
          color="text.secondary"
          lineHeight={1.6}
          mt={1}
          mb={2}
        >
          {description}
        </Typography>
      </Box>
      <CustomButton
        variant="contained"
        handlePressBtn={onUpdate}
        btnLabel="Update"
        btnPadding="4px 10px"
      />
    </Box>
  );
};

export default SubscriptionCard;
