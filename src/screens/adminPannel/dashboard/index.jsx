import React, { useEffect, useState } from 'react';
import { Box, CircularProgress, Grid } from '@mui/material';
import { styled } from '@mui/material/styles';
import Sidebar from '../../../components/sidebar';
import Header from '../../../components/header';
import DashboardContent from './DashboardContent';
import GrowthView from './growthView';
import OrderStatus from './orderStatus';
import UserOverview from './userOverview';
import CreatorOverview from './creatorOverview';
import useDashboard from '../../../hook/dashboard';
import { adminMenuItems } from '../../../constants/adminMenuItems';

const MainContent = styled(Box)(({ theme, collapsed }) => ({
  marginLeft: collapsed ? '80px' : '250px',
  minHeight: 'calc(100vh - 80px)',
  backgroundColor: '#f5f5f5',
  padding: '24px',
  paddingTop: '32px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'stretch',
  transition: 'margin-left 0.3s ease',
  width: 'auto',
  maxWidth: '100%',
  overflowX: 'hidden',
  boxSizing: 'border-box',
  minWidth: 0,
  [theme.breakpoints.down('md')]: {
    marginLeft: '0px',
    width: '100%',
  },
  [theme.breakpoints.down('sm')]: {
    marginLeft: '0px',
    padding: '16px',
    width: '100%',
  },
}));

const ChartsSection = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  width: '100%',
  minWidth: 0,
}));

const Dashboard = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [dashboardReady, setDashboardReady] = useState(false);
  const { dashboardData, fetchDashboard } = useDashboard();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      await fetchDashboard();
      if (!cancelled) setDashboardReady(true);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleToggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <>
      <Header sidebarCollapsed={collapsed} />
      <Sidebar menuItems={adminMenuItems} activeItem="Dashboard" collapsed={collapsed} onToggle={handleToggleSidebar} />
      <MainContent collapsed={collapsed}>
        {!dashboardReady ? (
          <Box
            sx={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: 'calc(100vh - 100px)',
              width: '100%',
            }}
          >
            <CircularProgress sx={{ color: '#5E1321' }} />
          </Box>
        ) : (
          <Box sx={{ width: '100%', maxWidth: '100%', minWidth: 0, boxSizing: 'border-box' }}>
            <DashboardContent
              dashboardData={dashboardData?.stats ?? dashboardData}
            />

            <ChartsSection>
              <Grid container spacing={{ xs: 3, md: 4 }} sx={{ width: '100%', minWidth: 0 }}>
                <GrowthView data={dashboardData?.growthOverview} />
                <OrderStatus data={dashboardData?.orderStatus} />
              </Grid>
            </ChartsSection>

            <ChartsSection>
              <Grid container spacing={{ xs: 3, md: 4 }} sx={{ width: '100%', minWidth: 0 }}>
                <UserOverview
                  data={dashboardData?.usersOverview ?? dashboardData?.stats?.usersOverview}
                />
                <CreatorOverview
                  data={
                    dashboardData?.creatorsOverview ??
                    dashboardData?.stats?.creatorsOverview
                  }
                />
              </Grid>
            </ChartsSection>
          </Box>
        )}
      </MainContent>
    </>
  );
};

export default Dashboard;
