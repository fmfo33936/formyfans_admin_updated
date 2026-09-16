import { Box, TableCell, Typography } from "@mui/material";
import { useCallback, useEffect, useMemo, useState } from "react";
import CustomToggle from "../../../components/customToggle";
import Header from "../../../components/header";
import PaginatedTable from "../../../components/dynamicTable";
import Sidebar from "../../../components/sidebar";
import { useCreators } from "../../../hook/creators";
import { adminMenuItems } from "../../../constants/adminMenuItems";
import CustomButton from "../../../components/customButton";
import CreateCreator from "./createCreator";

const formatJoinedAt = (iso) => {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString(undefined, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const Creators = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const {
    creators,
    pagination,
    loading,
    fetchCreators,
    updateCreatorStatus,
    statusUpdatingId,
    updateCreatorFreeAccess,
    freeAccessUpdatingId,
  } = useCreators();

  const handleStatusToggle = useCallback(
    (creatorId, nextActive) => {
      const status = nextActive ? "active" : "inactive";
      updateCreatorStatus(creatorId, status);
    },
    [updateCreatorStatus],
  );

  useEffect(() => {
    fetchCreators({ page: 1, limit: 10 });
  }, [fetchCreators]);

  const handleToggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const tableHeader = [
    { id: "name", label: "Name", width: "16%", minWidth: 140 },
    { id: "email", label: "Email", width: "22%", minWidth: 180 },
    { id: "phoneNumber", label: "Phone Number", width: "14%", minWidth: 130 },
    { id: "joinedAt", label: "Joined At", width: "12%", minWidth: 110 },
    { id: "status", label: "Status", align: "center", width: "10%", minWidth: 90 },
    { id: "freeTrial", label: "Free Trial", align: "center", width: "26%", minWidth: 240 },
  ];

  const displayRows = ["name", "email", "phoneNumber", "joinedAt", "status", "freeTrial"];

  const tableData = useMemo(
    () =>
      creators.map((c) => {
        const fullName = [c.firstName, c.lastName].filter(Boolean).join(" ").trim();
        return {
          _id: c._id,
          id: c._id,
          name: fullName || "—",
          email: c.email ?? "—",
          phoneNumber: c.phoneNumber?.trim() ? c.phoneNumber : "—",
          joinedAt: formatJoinedAt(c.createdAt),
          status: c.status ?? "—",
          isAdminCreator: c.isAdminCreator === true,
          freeMonthsExpireAt: c.freeMonthsExpireAt ?? null,
          freeTrial: c.freeMonthsExpireAt
            ? `Until ${formatJoinedAt(c.freeMonthsExpireAt)}`
            : "No free trial",
        };
      }),
    [creators],
  );

  const limit = pagination.limit || 10;
  const apiPage = pagination.page ?? 1;
  const muiPage = Math.max(0, apiPage - 1);

  const handleOpenCreate = () => {
    setEditItem(null);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditItem(null);
  };

  return (
    <Box sx={{ overflowX: "hidden", maxWidth: "100%" }}>
      <Header sidebarCollapsed={collapsed} />
      <Sidebar
        menuItems={adminMenuItems}
        activeItem="Creators"
        collapsed={collapsed}
        onToggle={handleToggleSidebar}
      />
      <Box
        sx={{
          marginLeft: { xs: 0, sm: 0, md: collapsed ? "80px" : "250px" },
          marginTop: "5px",
          minHeight: "calc(100vh - 80px)",
          backgroundColor: "#f5f5f5",
          padding: { xs: "16px", sm: "20px", md: "24px" },
          paddingTop: "32px",
          transition: "margin-left 0.3s ease",
          maxWidth: { xs: "100%", md: "min(1600px, 100%)" },
          width: { xs: "100%", md: "auto" },
          minWidth: 0,
          overflowX: "hidden",
          boxSizing: "border-box",
        }}
      >
        <Box
          display="flex"
          flexDirection={{ xs: "column", sm: "row" }}
          alignItems={{ xs: "flex-start", sm: "center" }}
          justifyContent="space-between"
          gap={2}
          mb={4}
        >
          <Typography fontSize={{ xs: 24, md: 28 }} fontWeight={700} color="#333333">
            List of Creators
          </Typography>
          <CustomButton
            btnLabel="Add Creator"
            handlePressBtn={handleOpenCreate}
            btnBgColor="#FF1572"
            btnHoverColor="#e01265"
            borderRadius="10px"
            btnPadding="10px 24px"
          />
        </Box>

        <Box sx={{ width: "100%", minWidth: 0, maxWidth: "100%" }}>
          <PaginatedTable
            tableHeader={tableHeader}
            tableData={tableData}
            displayRows={displayRows}
            headerBgColor="#5E1321"
            isLoading={loading}
            switchStatusLoadingId={statusUpdatingId}
            tableWidth="100%"
            enableHorizontalScroll
            serverSidePagination
            totalCount={pagination.totalUsers ?? 0}
            page={muiPage}
            rowsPerPage={limit}
            onPageChange={(_event, newPage) => {
              fetchCreators({ page: newPage + 1, limit });
            }}
            onRowsPerPageChange={(_event, newLimit) => {
              fetchCreators({ page: 1, limit: newLimit });
            }}
            customRenderCell={(row, val) => {
              if (val === "freeTrial") {
                const hasFreeTrial =
                  row.isAdminCreator && Boolean(row.freeMonthsExpireAt);
                const isUpdating = freeAccessUpdatingId === row._id;
                return (
                  <TableCell
                    key={val}
                    align="center"
                    sx={{ verticalAlign: "middle", py: 1.5 }}
                  >
                    <Box
                      display="flex"
                      flexDirection="column"
                      alignItems="center"
                      justifyContent="center"
                      gap={0.75}
                    >
                      <Typography
                        fontSize={14}
                        fontWeight={600}
                        color="#5E1321"
                        sx={{ whiteSpace: "nowrap" }}
                      >
                        {row.freeTrial}
                      </Typography>
                      {hasFreeTrial && (
                        <CustomButton
                          btnLabel="Cancel Free Trial"
                          handlePressBtn={() =>
                            updateCreatorFreeAccess(row._id, 0)
                          }
                          btnBgColor="#fff"
                          btnTextColor="#FF1572"
                          borderColor="#FF1572"
                          isBorder
                          borderRadius="8px"
                          btnPadding="5px 10px"
                          btnTextSize="12px"
                          height="30px"
                          sx={{ whiteSpace: "nowrap" }}
                          loading={isUpdating}
                          disabled={isUpdating}
                        />
                      )}
                    </Box>
                  </TableCell>
                );
              }

              if (val === "phoneNumber") {
                return (
                  <TableCell key={val} sx={{ verticalAlign: "middle", whiteSpace: "nowrap" }}>
                    <Typography fontSize={15} fontWeight={600} color="#5E1321">
                      {row.phoneNumber}
                    </Typography>
                  </TableCell>
                );
              }

              if (val !== "status") return null;

              const active = String(row.status).toLowerCase() === "active";
              return (
                <TableCell key={val} align="center" sx={{ verticalAlign: "middle" }}>
                  <CustomToggle
                    checked={active}
                    hideLabels
                    onChange={(e) =>
                      handleStatusToggle(row._id, e.target.checked)
                    }
                  />
                </TableCell>
              );
            }}
          />
        </Box>
      </Box>
      <CreateCreator
        open={dialogOpen}
        editItem={editItem}
        onClose={handleCloseDialog}
        onSuccess={() => fetchCreators({ page: apiPage, limit })}
      />
    </Box>
  );
};

export default Creators;
