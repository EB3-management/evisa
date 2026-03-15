import { useTable , TableHeadCustom, TablePaginationCustom } from "src/components/table";
import {
  TableContainer,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Tooltip,
  Typography,
  Card,
} from "@mui/material";
import { Icon } from "@iconify/react";
import { Scrollbar } from "src/components/scrollbar";

const daysInMonth = 31;

const TABLE_HEAD = [
  { id: "employeeName", label: "Employee Name", stickyLeft: true },
  ...Array.from({ length: daysInMonth }, (_, i) => ({
    id: `day${i + 1}`,
    label: i + 1,
    align: "center",
  })),
  { id: "total", label: "Total", align: "center", stickyRight: true },
];

export function AttendanceTable({ employees = [] }) {
  const table = useTable();

  return (
    <Card>
      <Scrollbar>
        <TableContainer sx={{ minWidth: 960 }}>
          <Table size={table.dense ? "small" : "medium"} stickyHeader>
            <TableHeadCustom
              order={table.order}
              orderBy={table.orderBy}
              headCells={TABLE_HEAD}
              numSelected={0}
              rowCount={employees.length}
              onSort={table.onSort}
              sx={{
                "& th:first-of-type": {
                  position: "sticky",
                  left: 0,
                  backgroundColor: "#fff",
                  zIndex: 3,
                },
                "& th:last-of-type": {
                  position: "sticky",
                  right: 0,
                  backgroundColor: "#fff",
                  zIndex: 3,
                },
              }}
            />

            <TableBody>
              {employees
                .slice(
                  table.page * table.rowsPerPage,
                  table.page * table.rowsPerPage + table.rowsPerPage
                )
                .map((emp) => {
                  let totalPresent = 0;

                  // Map: bs_dayNumber => record
                  const attendanceMap = {};
                  emp.attendance.forEach((record) => {
                    const bsDay = parseInt(record.bs_date.split("-")[2], 10);
                    attendanceMap[bsDay] = record;
                  });

                  return (
                    <TableRow key={emp.name}>
                      <TableCell
                        sx={{
                          position: "sticky",
                          left: 0,
                          backgroundColor: "#fff",
                          zIndex: 1,
                          minWidth: 150,
                        }}
                      >
                        {emp.name}
                      </TableCell>

                      {Array.from({ length: daysInMonth }).map((_, i) => {
                        const day = i + 1;
                        const record = attendanceMap[day];

                        if (!record) {
                          return (
                            <TableCell key={day} align="center">
                              {/* - */}
                              <Icon icon="mdi:close" color="red" width={18} />
                            </TableCell>
                          );
                        }

                        totalPresent++;
                        return (
                          <TableCell key={day} align="center">
                            <Tooltip
                              title={`Check-In: ${
                                record.check_in || "-"
                              } | Check-Out: ${record.check_out || "-"}`}
                            >
                              <Icon
                                icon="mdi:check-bold"
                                color="green"
                                width={18}
                              />
                            </Tooltip>
                          </TableCell>
                        );
                      })}

                      <TableCell
                        align="center"
                        sx={{
                          position: "sticky",
                          right: 0,
                          backgroundColor: "#fff",
                          zIndex: 1,
                          minWidth: 100,
                        }}
                      >
                        <Typography variant="caption">
                          {totalPresent}/{daysInMonth}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
      </Scrollbar>

      <TablePaginationCustom
        count={employees.length}
        page={table.page}
        rowsPerPage={table.rowsPerPage}
        onPageChange={table.onChangePage}
        onRowsPerPageChange={table.onChangeRowsPerPage}
        dense={table.dense}
        onChangeDense={table.onChangeDense}
      />
    </Card>
  );
}
