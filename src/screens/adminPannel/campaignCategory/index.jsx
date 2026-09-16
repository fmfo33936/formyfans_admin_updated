import { Box, IconButton, TableCell, Typography } from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { useCallback, useEffect, useMemo, useState } from "react";
import Header from "../../../components/header";
import Sidebar from "../../../components/sidebar";
import CustomButton from "../../../components/customButton";
import ConfirmDialog from "../../../components/confirmDialog";
import PaginatedTable from "../../../components/dynamicTable";
import { adminMenuItems } from "../../../constants/adminMenuItems";
import { useCampaignCategories } from "../../../hook/campaignCategory";
import AddCampaignCategory from "./addCategory";

const CampaignCategory = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const {
    categories,
    pagination,
    loading,
    fetchCategories,
    deleteCategory,
    deleteLoadingId,
  } = useCampaignCategories();

  const handleToggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  useEffect(() => {
    fetchCategories({ page: 1, limit: 50 });
  }, [fetchCategories]);

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
    const response = await deleteCategory(id);
    if (response?.success) {
      setDeleteTarget(null);
      fetchCategories({
        page: pagination.page ?? 1,
        limit: pagination.limit ?? 50,
      });
    }
  }, [
    deleteTarget,
    deleteCategory,
    fetchCategories,
    pagination.page,
    pagination.limit,
  ]);

  const tableHeader = [
    { id: "srNo", label: "Sr No", minWidth: 70 },
    { id: "name", label: "Name", minWidth: 200 },
    { id: "actions", label: "Action", align: "center", minWidth: 120 },
  ];

  const displayRows = ["srNo", "name", "actions"];

  const limit = pagination.limit || 50;
  const apiPage = pagination.page ?? 1;
  const muiPage = Math.max(0, apiPage - 1);

  const tableData = useMemo(
    () =>
      categories.map((item, index) => ({
        _id: item._id ?? item.id,
        id: item._id ?? item.id,
        rawItem: item,
        srNo: (apiPage - 1) * limit + index + 1,
        name: item.name ?? "—",
      })),
    [categories, apiPage, limit],
  );

  const customRenderCell = useCallback(
    (row, val) => {
      if (val !== "actions") return null;
      const isDeleting = deleteLoadingId === row._id;
      return (
        <TableCell key={val} align="center">
          <IconButton
            aria-label="Edit campaign category"
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
        activeItem="Campaign Category"
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
            Campaign Category
          </Typography>
          <CustomButton
            btnLabel="Add Campaign Category"
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
              fetchCategories({ page: newPage + 1, limit });
            }}
            onRowsPerPageChange={(_event, newLimit) => {
              fetchCategories({ page: 1, limit: newLimit });
            }}
            customRenderCell={customRenderCell}
          />
        </Box>
      </Box>

      <AddCampaignCategory
        open={dialogOpen}
        editItem={editItem}
        onClose={handleCloseDialog}
        onSuccess={() => fetchCategories({ page: apiPage, limit })}
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete Campaign Category"
        message={`Are you sure you want to delete "${deleteTarget?.name ?? "this category"}"?`}
        confirmLabel="Yes"
        loading={Boolean(deleteLoadingId)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
      />
    </Box>
  );
};

export default CampaignCategory;
