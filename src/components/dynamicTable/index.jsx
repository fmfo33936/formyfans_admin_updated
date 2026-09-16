import {
  Box,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";
import { useMemo, useState } from "react";
import TableSkeleton from "../skeleton/tableSkeleton";

const HEADER_TEXT = "#FFFFFF";
const CELL_TEXT = "#5E1321";
const ACTIVE_GREEN = "#0CA904";
const ACTIVE_BG = "rgba(12, 169, 4, 0.12)";
const INACTIVE_TEXT = "#757575";
const INACTIVE_BG = "rgba(117, 117, 117, 0.12)";

/**
 * Lightweight paginated data table aligned with admin styling (#5E1321 header).
 * Extend via `customRenderCell` or add cases in `renderCell` as needed.
 */
export default function PaginatedTable({
  tableWidth,
  tableHeader = [],
  tableData = [],
  displayRows = [],
  isLoading = false,
  showPagination = true,
  hidepagination = false,
  serverSidePagination = false,
  totalCount = 0,
  page: externalPage,
  rowsPerPage: externalRowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  getRowId = (row) => row.id ?? row._id ?? JSON.stringify(row),
  customRenderCell,
  headerBgColor = "#5E1321",
  skeletonRows = 5,
  rowsPerPageOptions = [5, 10, 25],
  /** When set (e.g. row `_id` during status PATCH), table body shows same skeleton as `isLoading`. */
  switchStatusLoadingId = null,
  /** Allow wide tables to scroll horizontally instead of crushing columns. */
  enableHorizontalScroll = false,
}) {
  const [internalPage, setInternalPage] = useState(0);
  const [internalRowsPerPage, setInternalRowsPerPage] = useState(10);

  const showTableSkeleton = isLoading || switchStatusLoadingId != null;

  const page = serverSidePagination ? (externalPage ?? 0) : internalPage;
  const rowsPerPage = serverSidePagination
    ? (externalRowsPerPage ?? 10)
    : internalRowsPerPage;

  const columnKeys = useMemo(
    () => (Array.isArray(displayRows) ? displayRows : []),
    [displayRows],
  );

  /** Keep header/body columns in the same order as `displayRows` */
  const orderedColumns = useMemo(() => {
    const headerById = Object.fromEntries(
      (tableHeader || []).map((h) => [h.id, h]),
    );
    if (columnKeys.length > 0) {
      return columnKeys.map(
        (key) => headerById[key] ?? { id: key, label: key },
      );
    }
    return tableHeader;
  }, [tableHeader, columnKeys]);

  const getColumnMeta = (columnId) =>
    orderedColumns.find((col) => col.id === columnId) ?? {};

  const handleChangePage = (_event, newPage) => {
    if (serverSidePagination && onPageChange) {
      onPageChange(_event, newPage);
    } else {
      setInternalPage(newPage);
    }
  };

  const handleChangeRowsPerPage = (event) => {
    const value = parseInt(event.target.value, 10);
    if (serverSidePagination && onRowsPerPageChange) {
      onRowsPerPageChange(event, value);
    } else {
      setInternalRowsPerPage(value);
      setInternalPage(0);
    }
  };

  const paginatedData =
    !showPagination || hidepagination
      ? tableData
      : serverSidePagination
        ? tableData
        : tableData?.slice(
            page * rowsPerPage,
            page * rowsPerPage + rowsPerPage,
          );

  const renderCell = (row, val) => {
    if (customRenderCell) {
      const custom = customRenderCell(row, val);
      if (custom != null) return custom;
    }

    switch (val) {
      case "status": {
        const raw = row.status;
        const label =
          typeof raw === "boolean" ? (raw ? "Active" : "Inactive") : raw ?? "—";
        const isActive =
          label === "Active" ||
          String(label).toLowerCase() === "active" ||
          raw === true;
        const isInactive =
          label === "Inactive" ||
          String(label).toLowerCase() === "inactive" ||
          raw === false;

        if (isActive || isInactive) {
          return (
            <TableCell key={val} align="center">
              <Chip
                label={typeof raw === "boolean" ? (raw ? "Active" : "Inactive") : label}
                size="small"
                sx={{
                  height: 28,
                  fontSize: 13,
                  fontWeight: 600,
                  backgroundColor: isActive ? ACTIVE_BG : INACTIVE_BG,
                  color: isActive ? ACTIVE_GREEN : INACTIVE_TEXT,
                  border: "none",
                  "& .MuiChip-label": { px: 1.5 },
                }}
              />
            </TableCell>
          );
        }


        return (
          <TableCell key={val} align="center">
            <Typography
              fontSize={16}
              fontWeight={600}
              sx={{ color: CELL_TEXT }}
            >
              {String(label)}
            </Typography>
          </TableCell>
        );
      }
      default: {
        const cellValue = row[val];
        const { align = "left" } = getColumnMeta(val);
        return (
          <TableCell
            key={val}
            align={align}
            sx={{ overflow: "hidden", verticalAlign: "middle" }}
          >
            <Typography
              fontSize={16}
              fontWeight={600}
              sx={{
                color: CELL_TEXT,
                overflowWrap: "anywhere",
                wordBreak: "break-word",
              }}
            >
              {cellValue ?? "—"}
            </Typography>
          </TableCell>
        );
      }
    }
  };

  const count = totalCount || tableData?.length || 0;

  const computedMinWidth = useMemo(() => {
    if (!enableHorizontalScroll) return undefined;
    const sum = (tableHeader || []).reduce(
      (acc, col) => acc + (Number(col.minWidth) || 120),
      0,
    );
    return sum > 0 ? sum : 1200;
  }, [enableHorizontalScroll, tableHeader]);

  return (
    <TableContainer
      sx={{
        bgcolor: "transparent",
        borderRadius: "8px",
        overflowX: enableHorizontalScroll ? "auto" : "hidden",
        overflowY: "hidden",
        maxWidth: "100%",
        boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
      }}
    >
      <Table
        sx={{
          width: tableWidth || (enableHorizontalScroll ? "max-content" : "100%"),
          minWidth: enableHorizontalScroll
            ? computedMinWidth || tableWidth || "100%"
            : undefined,
          maxWidth: enableHorizontalScroll ? "none" : "100%",
          tableLayout: enableHorizontalScroll ? "auto" : "fixed",
          borderCollapse: "separate",
          borderSpacing: 0,
        }}
      >
        {orderedColumns.length > 0 ? (
          <colgroup>
            {orderedColumns.map((col) => (
              <col
                key={col.id}
                style={col.width ? { width: col.width } : undefined}
              />
            ))}
          </colgroup>
        ) : null}
        <TableHead>
          <TableRow>
            {orderedColumns.map((h, index) => (
              <TableCell
                key={h.id ?? index}
                align={h.align || "left"}
                sx={{
                  backgroundColor: headerBgColor,
                  borderBottom: "none",
                  py: 2,
                  px: 3,
                  minWidth: h.minWidth || 0,
                  width: h.width,
                  overflow: "hidden",
                  ...(index === 0 && {
                    borderTopLeftRadius: "8px",
                  }),
                  ...(index === orderedColumns.length - 1 && {
                    borderTopRightRadius: "8px",
                  }),
                }}
              >
                <Typography
                  fontSize={16}
                  fontWeight={600}
                  sx={{
                    color: HEADER_TEXT,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {h.label}
                </Typography>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>

        {showTableSkeleton ? (
          <TableSkeleton
            columns={Math.max(columnKeys.length, tableHeader.length, 1)}
            rows={skeletonRows}
          />
        ) : (
          <TableBody sx={{ bgcolor: "#fff" }}>
            {paginatedData?.length > 0 ? (
              paginatedData.map((row) => (
                <TableRow
                  key={getRowId(row)}
                  sx={{
                    "&:last-of-type td": { borderBottom: "none" },
                    "&:hover": { bgcolor: "#FAFAFA" },
                  }}
                >
                  {columnKeys.map((val) => renderCell(row, val))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={Math.max(columnKeys.length, 1)} align="center" sx={{ py: 4 }}>
                  <Typography fontSize={14} sx={{ color: CELL_TEXT, fontWeight: 500 }}>
                    No data found
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        )}
      </Table>

      {showPagination && !hidepagination && (
        <Box sx={{ bgcolor: "#fff", borderTop: "1px solid #E0E0E0" }}>
          <TablePagination
            component="div"
            count={count}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={rowsPerPageOptions}
            sx={{
              maxWidth: "100%",
              "& .MuiTablePagination-toolbar": {
                px: 2,
                flexWrap: "wrap",
                gap: 1,
                justifyContent: "flex-end",
                overflow: "hidden",
              },
              "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows": {
                fontSize: 14,
              },
            }}
          />
        </Box>
      )}
    </TableContainer>
  );
}
