import { useState, useEffect } from "react";
import { useSetState } from "minimal-shared/hooks";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";

import { paths } from "src/routes/paths";

import { DashboardContent } from "src/layouts/dashboard";

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
} from "src/components/table";

import { useAppDispatch, useAppSelector } from "src/redux/hooks";
import { fetchFinancePlanRequest } from "src/redux/actions";
import { selectPlanState } from "src/redux/selectors";

import { PaymentTableRow } from "../payment-table-row";

const TABLE_HEAD = [
  { id: "sn", label: "SN" },
  { id: "plan_name", label: "Plan Name" },
  { id: "total_fee", label: "Total Fees" },
  { id: "paid_amount", label: "Paid Amount" },
  { id: "status", label: "Status" },
  { id: "due_amount", label: "Due Amount" },
  { id: "visa_type", label: "Visa Type" },
  { id: "updated_at", label: "Updated at" },
];

// ----------------------------------------------------------------------

export function PaymentListView() {
  const table = useTable();

  const dispatch = useAppDispatch();

  // FIXED: plan slice stores data under 'financePlan', not 'plan'
  const { financePlan: plan = [], isLoading } = useAppSelector(selectPlanState);

  useEffect(() => {
    dispatch(fetchFinancePlanRequest());
  }, [dispatch]);

  // const filters = useSetState({
  //   name: "",
  //   role: [],
  //   startDate: null,
  //   endDate: null,
  // });

  // const { state: currentFilters, setState: updateFilters } = filters;

  const dataFiltered = plan;

  const notFound = !dataFiltered.length && !isLoading;

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        links={[
          { name: "Dashboard", href: paths.dashboard.root },
          {
            name: "Payment",
            href: paths.dashboard.appointment.root,
          },
          { name: "List" },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Card>
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
                {dataFiltered
                  .slice(
                    table.page * table.rowsPerPage,
                    table.page * table.rowsPerPage + table.rowsPerPage
                  )
                  .map((row, index) => (
                    <PaymentTableRow
                      key={row.id}
                      serialNumber={index + 1}
                      row={row}
                    />
                  ))}

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
