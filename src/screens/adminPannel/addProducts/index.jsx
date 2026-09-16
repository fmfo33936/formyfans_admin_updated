// import { Box, IconButton, TableCell, Typography } from "@mui/material";
// import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
// import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
// import { useCallback, useEffect, useMemo, useState } from "react";
// import Header from "../../../components/header";
// import Sidebar from "../../../components/sidebar";
// import CustomButton from "../../../components/customButton";
// import PaginatedTable from "../../../components/dynamicTable";
// import { adminMenuItems } from "../../../constants/adminMenuItems";
// import { useProducts } from "../../../hook/products";
// import AddProduct from "./addProduct";

// const formatList = (value) => {
//     if (!Array.isArray(value) || !value.length) return "—";
//     return value.join(", ");
// };

// const truncateText = (text, max = 60) => {
//     if (!text || text === "—") return "—";
//     const str = String(text);
//     return str.length > max ? `${str.slice(0, max)}...` : str;
// };

// const AddProducts = () => {
//     const [collapsed, setCollapsed] = useState(false);
//     const [addProductOpen, setAddProductOpen] = useState(false);
//     const [editProduct, setEditProduct] = useState(null);

//     const {
//         products,
//         pagination,
//         loading,
//         fetchProducts,
//         deleteProduct,
//         deleteLoadingId,
//     } = useProducts();

//     const handleToggleSidebar = () => {
//         setCollapsed(!collapsed);
//     };

//     const handleOpenCreate = () => {
//         setEditProduct(null);
//         setAddProductOpen(true);
//     };

//     const handleOpenEdit = (product) => {
//         setEditProduct(product);
//         setAddProductOpen(true);
//     };

//     const handleCloseDialog = () => {
//         setAddProductOpen(false);
//         setEditProduct(null);
//     };

//     const handleDelete = useCallback(
//         async (product) => {
//             const id = product._id ?? product.id;
//             if (!id) return;
//             const confirmed = window.confirm(
//                 `Delete "${product.name ?? "this product"}"?`,
//             );
//             if (!confirmed) return;
//             const response = await deleteProduct(id);
//             if (response?.success) {
//                 fetchProducts({ page: pagination.page ?? 1, limit: pagination.limit ?? 10 });
//             }
//         },
//         [deleteProduct, fetchProducts, pagination.page, pagination.limit],
//     );

//     useEffect(() => {
//         fetchProducts({ page: 1, limit: 10 });
//     }, [fetchProducts]);

//     const tableHeader = [
//         { id: "srNo", label: "Sr No", minWidth: 70 },
//         { id: "name", label: "Product Name", minWidth: 140 },
//         { id: "description", label: "Product Description", minWidth: 180 },
//         { id: "totalPrice", label: "Total Price", minWidth: 110 },
//         { id: "quantity", label: "Quantity", minWidth: 90 },
//         { id: "size", label: "Size", minWidth: 100 },
//         { id: "colour", label: "Color", minWidth: 120 },
//         { id: "actions", label: "Actions", align: "center", minWidth: 100 },
//     ];

//     const displayRows = [
//         "srNo",
//         "name",
//         "description",
//         "totalPrice",
//         "quantity",
//         "size",
//         "colour",
//         "actions",
//     ];

//     const limit = pagination.limit || 10;
//     const apiPage = pagination.page ?? 1;
//     const muiPage = Math.max(0, apiPage - 1);

//     const tableData = useMemo(
//         () =>
//             products.map((product, index) => ({
//                 _id: product._id ?? product.id,
//                 id: product._id ?? product.id,
//                 rawProduct: product,
//                 srNo: (apiPage - 1) * limit + index + 1,
//                 name: product.name ?? "—",
//                 description: truncateText(product.description),
//                 totalPrice:
//                     product.totalPrice != null ? `$${product.totalPrice}` : "—",
//                 quantity: product.quantity ?? "—",
//                 size: formatList(product.size),
//                 colour: formatList(product.colour),
//             })),
//         [products, apiPage, limit],
//     );

//     const customRenderCell = useCallback(
//         (row, val) => {
//             if (val !== "actions") return null;
//             const isDeleting = deleteLoadingId === row._id;
//             return (
//                 <TableCell key={val} align="center">
//                     <IconButton
//                         aria-label="Edit product"
//                         size="small"
//                         disabled={isDeleting}
//                         onClick={() => handleOpenEdit(row.rawProduct)}
//                         sx={{
//                             color: "#5E1321",
//                             "&:hover": { bgcolor: "rgba(94, 19, 33, 0.1)" },
//                         }}
//                     >
//                         <EditOutlinedIcon fontSize="small" />
//                     </IconButton>
//                     <IconButton
//                         aria-label="Delete product"
//                         size="small"
//                         disabled={isDeleting}
//                         onClick={() => handleDelete(row.rawProduct)}
//                         sx={{
//                             color: "#FF1572",
//                             "&:hover": { bgcolor: "rgba(255, 21, 114, 0.1)" },
//                         }}
//                     >
//                         <DeleteOutlineIcon fontSize="small" />
//                     </IconButton>
//                 </TableCell>
//             );
//         },
//         [deleteLoadingId, handleDelete],
//     );

//     return (
//         <Box sx={{ overflowX: "hidden", maxWidth: "100%" }}>
//             <Header sidebarCollapsed={collapsed} />
//             <Sidebar
//                 menuItems={adminMenuItems}
//                 activeItem="Add Product"
//                 collapsed={collapsed}
//                 onToggle={handleToggleSidebar}
//             />
//             <Box
//                 sx={{
//                     marginLeft: { xs: 0, sm: 0, md: collapsed ? "80px" : "250px" },
//                     marginTop: "5px",
//                     minHeight: "calc(100vh - 80px)",
//                     backgroundColor: "#f5f5f5",
//                     padding: { xs: "16px", sm: "20px", md: "24px" },
//                     paddingTop: "32px",
//                     transition: "margin-left 0.3s ease",
//                     maxWidth: { xs: "100%", md: "min(1600px, 100%)" },
//                     width: { xs: "100%", md: "auto" },
//                     minWidth: 0,
//                     overflowX: "hidden",
//                     boxSizing: "border-box",
//                 }}
//             >
//                 <Box
//                     display="flex"
//                     flexDirection={{ xs: "column", sm: "row" }}
//                     alignItems={{ xs: "flex-start", sm: "center" }}
//                     justifyContent="space-between"
//                     gap={2}
//                     mb={4}
//                 >
//                     <Typography
//                         fontSize={{ xs: 24, md: 28 }}
//                         fontWeight={700}
//                         color="#333333"
//                     >
//                         Products
//                     </Typography>
//                     <CustomButton
//                         btnLabel="Add Product"
//                         handlePressBtn={handleOpenCreate}
//                         btnBgColor="#FF1572"
//                         btnHoverColor="#e01265"
//                         borderRadius="10px"
//                         btnPadding="10px 24px"
//                     />
//                 </Box>

//                 <Box sx={{ width: "100%", minWidth: 0, maxWidth: "100%" }}>
//                     <PaginatedTable
//                         tableHeader={tableHeader}
//                         tableData={tableData}
//                         displayRows={displayRows}
//                         headerBgColor="#5E1321"
//                         isLoading={loading}
//                         switchStatusLoadingId={deleteLoadingId}
//                         serverSidePagination
//                         totalCount={pagination.totalProducts ?? 0}
//                         page={muiPage}
//                         rowsPerPage={limit}
//                         onPageChange={(_event, newPage) => {
//                             fetchProducts({ page: newPage + 1, limit });
//                         }}
//                         onRowsPerPageChange={(_event, newLimit) => {
//                             fetchProducts({ page: 1, limit: newLimit });
//                         }}
//                         customRenderCell={customRenderCell}
//                     />
//                 </Box>
//             </Box>

//             <AddProduct
//                 open={addProductOpen}
//                 onClose={handleCloseDialog}
//                 editProduct={editProduct}
//                 onSuccess={() =>
//                     fetchProducts({ page: apiPage, limit })
//                 }
//             />
//         </Box>
//     );
// };

// export default AddProducts;
