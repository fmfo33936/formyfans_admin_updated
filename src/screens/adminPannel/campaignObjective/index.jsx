import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import { Avatar, Box, IconButton, TableCell, Typography } from "@mui/material";
import { useCallback, useEffect, useMemo, useState } from "react";
import ConfirmDialog from "../../../components/confirmDialog";
import CustomButton from "../../../components/customButton";
import PaginatedTable from "../../../components/dynamicTable";
import Header from "../../../components/header";
import Sidebar from "../../../components/sidebar";
import { adminMenuItems } from "../../../constants/adminMenuItems";
import { useCampaignObjectives } from "../../../hook/campaignObjective";
import AddCampaignObjective from "./addObjective";
import { getFullS3Url } from "../../../utils/s3Helper";

const truncateText = (text, max = 80) => {
  if (!text || text === "—") return "—";
  const str = String(text);
  return str.length > max ? `${str.slice(0, max)}...` : str;
};

const CampaignObjective = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const {
    objectives,
    pagination,
    loading,
    fetchObjectives,
    deleteObjective,
    deleteLoadingId,
  } = useCampaignObjectives();

  const handleToggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  useEffect(() => {
    fetchObjectives({ page: 1, limit: 50 });
  }, [fetchObjectives]);

  const handleOpenCreate = () => {
    setEditItem(null);
    setDialogOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditItem(item);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditItem(null);
  };

  const handleDeleteConfirm = useCallback(async () => {
    const id = deleteTarget?._id ?? deleteTarget?.id;
    if (!id) return;
    const response = await deleteObjective(id);
    if (response?.success) {
      setDeleteTarget(null);
      fetchObjectives({
        page: pagination.page ?? 1,
        limit: pagination.limit ?? 50,
      });
    }
  }, [
    deleteTarget,
    deleteObjective,
    fetchObjectives,
    pagination.page,
    pagination.limit,
  ]);

  const tableHeader = [
    { id: "icon", label: "Icon", width: 90, minWidth: 90, align: "center" },
    { id: "name", label: "Name", minWidth: 160 },
    { id: "description", label: "Description", minWidth: 220 },
    { id: "actions", label: "Action", align: "center", minWidth: 120 },
  ];

  const displayRows = ["icon", "name", "description", "actions"];

  const limit = pagination.limit || 50;
  const apiPage = pagination.page ?? 1;
  const muiPage = Math.max(0, apiPage - 1);

  const tableData = useMemo(
    () =>
      objectives.map((item) => {
        const iconUrl = String(item?.icon || item?.image || "").trim();
        return {
          _id: item._id ?? item.id,
          id: item._id ?? item.id,
          rawItem: item,
          icon: getFullS3Url(iconUrl),
          name: item.name ?? "—",
          description: truncateText(item.description),
        };
      }),
    [objectives],
  );

  const customRenderCell = useCallback(
    (row, val) => {
      if (val === "icon") {
        return (
          <TableCell
            key={val}
            align="center"
            sx={{ py: 1.5, verticalAlign: "middle" }}
          >
            <Avatar
              src={row.icon || undefined}
              alt={row.name}
              variant="rounded"
              imgProps={{
                referrerPolicy: "no-referrer",
                loading: "lazy",
              }}
              sx={{
                width: 44,
                height: 44,
                mx: "auto",
                bgcolor: "rgba(94, 19, 33, 0.08)",
                color: "#5E1321",
                border: "1px solid #E0E0E0",
                "& img": {
                  objectFit: "cover",
                },
              }}
            >
              <ImageOutlinedIcon fontSize="small" />
            </Avatar>
          </TableCell>
        );
      }

      if (val !== "actions") return null;

      const isDeleting = deleteLoadingId === row._id;
      return (
        <TableCell key={val} align="center">
          <IconButton
            aria-label="Edit campaign objective"
            size="small"
            disabled={isDeleting}
            onClick={() => handleOpenEdit(row.rawItem)}
            sx={{
              color: "#5E1321",
              "&:hover": { bgcolor: "rgba(94, 19, 33, 0.1)" },
            }}
          >
            <EditOutlinedIcon fontSize="small" />
          </IconButton>
        </TableCell>
      );
    },
    [deleteLoadingId],
  );

  return (
    <Box sx={{ overflowX: "hidden", maxWidth: "100%" }}>
      <Header sidebarCollapsed={collapsed} />
      <Sidebar
        menuItems={adminMenuItems}
        activeItem="Campaign Objective"
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
          <Typography
            fontSize={{ xs: 24, md: 28 }}
            fontWeight={700}
            color="#333333"
          >
            Campaign Objective
          </Typography>
          <CustomButton
            btnLabel="Add Campaign Objective"
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
            switchStatusLoadingId={deleteLoadingId}
            serverSidePagination
            totalCount={pagination.total ?? 0}
            page={muiPage}
            rowsPerPage={limit}
            rowsPerPageOptions={[10, 25, 50]}
            onPageChange={(_event, newPage) => {
              fetchObjectives({ page: newPage + 1, limit });
            }}
            onRowsPerPageChange={(_event, newLimit) => {
              fetchObjectives({ page: 1, limit: newLimit });
            }}
            customRenderCell={customRenderCell}
          />
        </Box>
      </Box>

      <AddCampaignObjective
        open={dialogOpen}
        editItem={editItem}
        onClose={handleCloseDialog}
        onSuccess={() => fetchObjectives({ page: apiPage, limit })}
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete Campaign Objective"
        message={`Are you sure you want to delete "${deleteTarget?.name ?? "this objective"}"?`}
        confirmLabel="Yes"
        loading={Boolean(deleteLoadingId)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
      />
    </Box>
  );
};

export default CampaignObjective;
