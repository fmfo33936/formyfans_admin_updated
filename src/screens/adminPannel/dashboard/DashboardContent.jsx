import React from "react";
import { Box, Grid, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import StatCard from "../../../components/statCard";
import PeopleIcon from "@mui/icons-material/People";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";

const WelcomeTitle = styled(Typography)(({ theme }) => ({
  fontSize: "28px",
  fontWeight: 700,
  color: "#333333",
  [theme.breakpoints.down("sm")]: {
    fontSize: "24px",
  },
}));

const WelcomeSubtitle = styled(Typography)(({ theme }) => ({
  fontSize: "14px",
  color: "#666666",
}));

const StatsSection = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  width: "100%",
  minWidth: 0,
}));

const formatNumber = (n) => Number(n ?? 0).toLocaleString();

const formatTrend = (pct) => {
  const n = Number(pct ?? 0);
  if (n === 0) return "0%";
  const sign = n > 0 ? "+" : "";
  return `${sign}${n}%`;
};

const DashboardContent = ({ dashboardData }) => {
  const d = dashboardData ?? {};

  const statCards = [
    {
      title: "Total Users",
      value: formatNumber(d.totalUsers?.count),
      icon: <PeopleIcon />,
      color: "#5E1321",
      trend: formatTrend(d.totalUsers?.percentageChange),
    },
    {
      title: "Total Orders",
      value: formatNumber(d.totalOrders?.count),
      icon: <ShoppingCartIcon />,
      color: "#FF1572",
      trend: formatTrend(d.totalOrders?.percentageChange),
    },
    {
      title: "Total Creators",
      value: formatNumber(d.totalCreators?.count),
      icon: <PersonAddIcon />,
      color: "#5E1321",
      trend: formatTrend(d.totalCreators?.percentageChange),
    },
    {
      title: "Revenue",
      value: `$${formatNumber(d.revenue?.total)}`,
      icon: <AttachMoneyIcon />,
      color: "#FF1572",
      trend: formatTrend(d.revenue?.percentageChange),
    },
  ];

  return (
    <>
      <WelcomeTitle>Welcome back, Admin</WelcomeTitle>
      <WelcomeSubtitle>Here is an overview of your activities</WelcomeSubtitle>

      <StatsSection>
        <Grid container spacing={2} width="100%" minWidth={0} mt={2}>
          {statCards.map((card) => (
            <Grid key={card.title} size={{ xs: 12, sm: 6, md: 3 }} sx={{ minWidth: 0 }}>
              <StatCard
                title={card.title}
                value={card.value}
                icon={card.icon}
                color={card.color}
                trend={card.trend}
              />
            </Grid>
          ))}
        </Grid>
      </StatsSection>
    </>
  );
};

export default DashboardContent;
