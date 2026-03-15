import { useEffect } from "react";
import { useSetState } from "minimal-shared/hooks";

import { Box, Card, Table, TableBody, Button } from "@mui/material";

import { paths } from "src/routes/paths";
import { RouterLink } from "src/routes/components";

import { fIsAfter, fIsBetween } from "src/utils/format-time";

import { DashboardContent } from "src/layouts/dashboard";

import { Iconify } from "src/components/iconify";
import { Scrollbar } from "src/components/scrollbar";
import { CustomBreadcrumbs } from "src/components/custom-breadcrumbs";
import {
  useTable,
  emptyRows,
  TableNoData,
  getComparator,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
  TableSkeleton,
} from "src/components/table";

import { useAppDispatch, useAppSelector } from "src/redux/hooks";
import {
  fetchAllPermissionsRequest,
  fetchEmployeesRequest,
} from "src/redux/actions";
import { selectEmployeeState } from "src/redux/selectors";

import { EmployeeTableRow } from "../employee-table-row";
import { EmployeeTableToolbar } from "../employee-table-toolbar";
import { EmployeeTableFiltersResult } from "../employee-table-filters-result";

const TABLE_HEAD = [
  { id: "sn", label: "SN" },
  { id: "name", label: "Name" },
  { id: "email", label: "Email" },
  { id: "contact_number", label: "Contact Number" },
  { id: "created_at", label: "Created At" },
  { id: "updated_at", label: "Updated At" },
  { id: "" },
];

// ----------------------------------------------------------------------

export function EmployeeListView() {
  const table = useTable();

  const dispatch = useAppDispatch();

  const { employees, isLoading } = useAppSelector(selectEmployeeState);

  const filters = useSetState({
    name: "",
    startDate: null,
    endDate: null,
  });

  useEffect(() => {
    dispatch(fetchEmployeesRequest());

    dispatch(fetchAllPermissionsRequest());
  }, [dispatch]);

  const { state: currentFilters, setState: updateFilters } = filters;

  const dateError = fIsAfter(currentFilters.startDate, currentFilters.endDate);

  const dataFiltered = applyFilter({
    inputData: employees,
    comparator: getComparator(table.order, table.orderBy),
    filters: currentFilters,
    dateError,
  });

  const canReset =
    !!currentFilters.name ||
    (!!currentFilters.startDate && !!currentFilters.endDate);

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        links={[
          { name: "Dashboard", href: paths.dashboard.root },
          { name: "Employee", href: paths.dashboard.employee.root },
          { name: "List" },
        ]}
        action={
          <Button
            variant="contained"
            component={RouterLink}
            href={paths.dashboard.employee.create}
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            Add Employee
          </Button>
        }
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Card>
        <EmployeeTableToolbar
          filters={filters}
          onResetPage={table.onResetPage}
        />

        {canReset && (
          <EmployeeTableFiltersResult
            filters={filters}
            totalResults={dataFiltered.length}
            onResetPage={table.onResetPage}
            sx={{ p: 2.5, pt: 0 }}
          />
        )}

        <Box sx={{ position: "relative" }}>
          <TableSelectedAction
            dense={table.dense}
            numSelected={table.selected.length}
            rowCount={dataFiltered.length}
            onSelectAllRows={(checked) =>
              table.onSelectAllRows(
                checked,
                dataFiltered.map((row) => row.id)
              )
            }
          />

          <Scrollbar>
            <Table
              size={table.dense ? "small" : "medium"}
              sx={{ minWidth: 960 }}
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
                {isLoading ? (
                  <TableSkeleton
                    rowCount={table.rowsPerPage}
                    cellCount={TABLE_HEAD.length}
                    sx={{ height: 69 }}
                  />
                ) : (
                  dataFiltered
                    .slice(
                      table.page * table.rowsPerPage,
                      table.page * table.rowsPerPage + table.rowsPerPage
                    )
                    .map((row, index) => (
                      <EmployeeTableRow
                        key={row.id}
                        //
                        serialNumber={index + 1}
                        row={row}
                      />
                    ))
                )}

                <TableEmptyRows
                  height={table.dense ? 56 : 56 + 20}
                  emptyRows={emptyRows(
                    table.page,
                    table.rowsPerPage,
                    dataFiltered.length
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
        />
      </Card>
    </DashboardContent>
  );
}

// ----------------------------------------------------------------------

function applyFilter({ inputData, comparator, filters, dateError }) {
  const { name, startDate, endDate } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (name) {
    inputData = inputData.filter((employee) =>
      employee.name.toLowerCase().includes(name.toLowerCase())
    );
  }

  if (!dateError) {
    if (startDate && endDate) {
      inputData = inputData.filter((employee) =>
        fIsBetween(employee.created_at, startDate, endDate)
      );
    }
  }

  return inputData;
}
