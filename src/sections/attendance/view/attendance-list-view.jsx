import Card from "@mui/material/Card";

import { paths } from "src/routes/paths";

import { DashboardContent } from "src/layouts/dashboard";

import { CustomBreadcrumbs } from "src/components/custom-breadcrumbs";
import { Button, Stack, Typography } from "@mui/material";
import { AttendanceTable } from "../attendance-table-rw";
import { fetchAttendanceData } from "src/api/hr-attendance";
import { useState } from "react";
import NepaliDateDialog from "../nepali-date";

export function AttendanceListView() {
  const [attendanceData, setAttendanceData] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  const handleSelectDate = async ({ year, month }) => {
    setSelectedDate({ year, month });
    const data = await fetchAttendanceData({ year, month });
    setAttendanceData(data);
  };

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        links={[
          { name: "Dashboard", href: paths.dashboard.root },
          {
            name: "Attendance",
            href: paths.dashboard.attendance.root,
          },
          { name: "List" },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ mb: 3 }}
      >
        <Typography variant="h6">
          {selectedDate
            ? `Attendance: ${selectedDate.year} / ${selectedDate.month}`
            : "Select Nepali Date"}
        </Typography>

        <Button variant="outlined" onClick={() => setDialogOpen(true)}>
          Select Date
        </Button>
      </Stack>

      <Card>
        <AttendanceTable employees={attendanceData.attendances} />
      </Card>
      <NepaliDateDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSelect={handleSelectDate}
        // onSelect={(date) => {
        //   console.log("Selected Nepali Date:", date);
        //   setSelectedDate(date); // { year: '2082', month: '02' }

        // }}
      />
    </DashboardContent>
  );
}

// ----------------------------------------------------------------------
