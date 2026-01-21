import {
  Box,
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Card,
  IconButton,
  MenuItem,
  Fab,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Iconify } from "src/components/iconify";
import { DashboardContent } from "src/layouts/dashboard";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { paths } from "src/routes/paths";
import { CustomBreadcrumbs } from "src/components/custom-breadcrumbs";
import { useAppDispatch, useAppSelector } from "src/redux/hooks";
import { fetchDocumentsRequest } from "src/redux/actions/documents-actions";
import {
  emptyRows,
  TableEmptyRows,
  TableHeadCustom,
  TableNoData,
  TablePaginationCustom,
  TableSelectedAction,
  useTable,
} from "src/components/table";
import { Scrollbar } from "src/components/scrollbar";
import { useSetState } from "minimal-shared/hooks";
import { DocumentsTableToolbar } from "src/sections/documents/documents-toolbar";
import { DocumentsTableRow } from "src/sections/documents/documents-item";
import { DocumentsTableFiltersResult } from "src/sections/documents/documents-result-filter";

const TABLE_HEAD = [
  { id: "sn", label: "S.N." },
  { id: "contract_number", label: "Contract #" },
  { id: "vacancy", label: "Position" },
  { id: "employer", label: "Employer" },
  { id: "location", label: "Location" },
  { id: "wages", label: "Wages" },
  { id: "status", label: "Status" },
  { id: "unsigned_pdf", label: "Unsigned PDF" },
  { id: "signed_pdf", label: "Signed PDF" },
  { id: "generated_at", label: "Generated At" },
];

export function ContractList() {
  const table = useTable();
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  const {
    documents = [],
    isLoading,
    error,
  } = useAppSelector(
    (state) => state.documents || { documents: [], isLoading: false },
  );

  const filters = useSetState({
    vacancy_id: "",
    status: "",
  });
  console.log("thi sis filwer", filters);
  // Fetch contracts on mount or when filters change
  useEffect(() => {
    const payload = {};
    if (filters.state.vacancy_id)
      payload.vacancy_id = Number(filters.state.vacancy_id);
    if (filters.state.status) payload.status = filters.state.status;

    dispatch(fetchDocumentsRequest(payload));
  }, [dispatch, filters.state.vacancy_id, filters.state.status]);

  console.log("this is documents", documents);

  const handleFilterVacancy = useCallback(
    (event) => {
      filters.setState({ vacancy_id: event.target.value });
      table.onResetPage();
    },
    [filters, table],
  );

  const handleFilterStatus = useCallback(
    (event) => {
      filters.setState({ status: event.target.value });
      table.onResetPage();
    },
    [filters, table],
  );

  const dataFiltered = documents;
  const notFound = !dataFiltered.length && !isLoading;
  const canReset = !!filters.state.vacancy_id || !!filters.state.status;

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        links={[
          { name: "Dashboard", href: paths.dashboard.root },
          {
            name: "Contracts",
            href: paths.dashboard.contract.root,
          },
          { name: "List" },
        ]}
        sx={{
          mb: { xs: 2, md: 5 },
          "& .MuiBreadcrumbs-ol": {
            flexWrap: { xs: "wrap", sm: "nowrap" },
          },
        }}
      />
      <Box sx={{ position: "relative" }}>
        {/* Header */}
        <Card
          sx={{
            borderRadius: { xs: 1, md: 2 },
            overflow: "hidden",
          }}
        >
          <DocumentsTableToolbar
            filters={filters}
            onResetPage={table.onResetPage}
          />

          {canReset && (
            <DocumentsTableFiltersResult
              filters={filters}
              totalResults={dataFiltered.length}
              onResetPage={table.onResetPage}
              sx={{ p: 2.5, pt: 0 }}
            />
          )}

          <Box sx={{ position: "relative" }}>
            <Scrollbar
              sx={{
                maxHeight: { xs: "calc(100vh - 300px)", md: "auto" },
              }}
            >
              <Table
                size={table.dense ? "small" : "medium"}
                sx={{
                  minWidth: { xs: 800, md: 960 },
                  "& .MuiTableCell-root": {
                    fontSize: { xs: "0.75rem", sm: "0.875rem" },
                    padding: { xs: "8px 4px", sm: "12px 16px" },
                  },
                }}
              >
                <TableHeadCustom
                  order={table.order}
                  orderBy={table.orderBy}
                  headCells={TABLE_HEAD}
                  rowCount={dataFiltered.length}
                  numSelected={table.selected.length}
                  onSort={table.onSort}
                />

                <TableBody>
                  {dataFiltered
                    .slice(
                      table.page * table.rowsPerPage,
                      table.page * table.rowsPerPage + table.rowsPerPage,
                    )
                    .map((row, index) => (
                      <DocumentsTableRow
                        key={row.id}
                        serialNumber={index + 1}
                        row={row}
                      />
                    ))}

                  <TableEmptyRows
                    height={table.dense ? 56 : 76}
                    emptyRows={emptyRows(
                      table.page,
                      table.rowsPerPage,
                      dataFiltered.length,
                    )}
                  />

                  <TableNoData notFound={notFound} />
                </TableBody>
              </Table>
            </Scrollbar>
          </Box>

          <TablePaginationCustom
            page={table.page}
            dense={table.dense}
            count={dataFiltered.length}
            rowsPerPage={table.rowsPerPage}
            onPageChange={table.onChangePage}
            onChangeDense={table.onChangeDense}
            onRowsPerPageChange={table.onChangeRowsPerPage}
            sx={{
              "& .MuiTablePagination-toolbar": {
                flexWrap: { xs: "wrap", sm: "nowrap" },
                minHeight: { xs: "auto", sm: 64 },
                py: { xs: 1, sm: 0 },
              },
            }}
          />
        </Card>
      </Box>
    </DashboardContent>
  );
}
