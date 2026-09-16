import { Box, TableCell, Typography } from "@mui/material";
import { useCallback, useEffect, useMemo, useState } from "react";
import CustomToggle from "../../../components/customToggle";
import Header from "../../../components/header";
import PaginatedTable from "../../../components/dynamicTable";
import Sidebar from "../../../components/sidebar";
import { useUsers } from "../../../hook/users";
import { adminMenuItems } from "../../../constants/adminMenuItems";

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

const Users = () => {
    const [collapsed, setCollapsed] = useState(false);
    const {
        users,
        pagination,
        loading,
        fetchUsers,
        updateUserStatus,
        statusUpdatingId,
    } = useUsers();

    const handleStatusToggle = useCallback(
        (userId, nextActive) => {
            const status = nextActive ? "active" : "inactive";
            updateUserStatus(userId, status);
        },
        [updateUserStatus],
    );

    useEffect(() => {
        fetchUsers({ page: 1, limit: 10 });
    }, [fetchUsers]);

    const handleToggleSidebar = () => {
        setCollapsed(!collapsed);
    };

    const tableHeader = [
        { id: "name", label: "Name" },
        { id: "email", label: "Email" },
        { id: "phoneNumber", label: "Phone Number" },
        { id: "joinedAt", label: "Joined At" },
        { id: "status", label: "Status", align: "center" },
    ];

    const displayRows = ["name", "email", "phoneNumber", "joinedAt", "status"];

    const tableData = useMemo(
        () =>
            users.map((u) => {
                const fullName = [u.firstName, u.lastName].filter(Boolean).join(" ").trim();
                return {
                    _id: u._id,
                    id: u._id,
                    name: fullName || "—",
                    email: u.email ?? "—",
                    phoneNumber: u.phoneNumber?.trim() ? u.phoneNumber : "—",
                    joinedAt: formatJoinedAt(u.createdAt),
                    status: u.status ?? "—",
                };
            }),
        [users],
    );

    const limit = pagination.limit || 10;
    const apiPage = pagination.page ?? 1;
    const muiPage = Math.max(0, apiPage - 1);

    return (
        <Box sx={{ overflowX: "hidden", maxWidth: "100%" }}>
            <Header sidebarCollapsed={collapsed} />
            <Sidebar
                menuItems={adminMenuItems}
                activeItem="Users"
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
                <Typography
                    fontSize={{ xs: 24, md: 28 }}
                    fontWeight={700}
                    color="#333333"
                    mb={4}
                >
                    List of Users
                </Typography>

                <Box sx={{ width: "100%", minWidth: 0, maxWidth: "100%" }}>
                    <PaginatedTable
                        tableHeader={tableHeader}
                        tableData={tableData}
                        displayRows={displayRows}
                        headerBgColor="#5E1321"
                        isLoading={loading}
                        switchStatusLoadingId={statusUpdatingId}
                        serverSidePagination
                        totalCount={pagination.totalUsers ?? 0}
                        page={muiPage}
                        rowsPerPage={limit}
                        onPageChange={(_event, newPage) => {
                            fetchUsers({ page: newPage + 1, limit });
                        }}
                        onRowsPerPageChange={(_event, newLimit) => {
                            fetchUsers({ page: 1, limit: newLimit });
                        }}
                        customRenderCell={(row, val) => {
                            if (val !== "status") return null;
                            const active =
                                String(row.status).toLowerCase() === "active";
                            return (
                                <TableCell key={val} align="center">
                                    <CustomToggle
                                        checked={active}
                                        hideLabels
                                        onChange={(e) =>
                                            handleStatusToggle(
                                                row._id,
                                                e.target.checked,
                                            )
                                        }
                                    />
                                </TableCell>
                            );
                        }}
                    />
                </Box>
            </Box>
        </Box>
    );
};

export default Users;
