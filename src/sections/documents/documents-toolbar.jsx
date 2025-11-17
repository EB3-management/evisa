import { TextField, Box, MenuItem, CircularProgress } from "@mui/material";

import { useCallback } from "react";
import { useGetAppliedVacancy, useGetVacancy } from "src/api/vacancy";

export function DocumentsTableToolbar({ filters, onResetPage }) {
  const { state: currentFilters, setState: updateFilters } = filters;
  // const { vacancy: vacancyList = [], vacancyLoading } = useGetVacancy();
  const {
    appliedVacancy: vacancyList = [],
    appliedVacancyLoading,
    mutateAppliedVacancy,
  } = useGetAppliedVacancy();

  const handleFilterVacancy = useCallback(
    (event) => {
      const selectedId = event.target.value;
      updateFilters({ vacancy_id: selectedId });
      onResetPage();
    },
    [updateFilters, onResetPage]
  );

  const handleFilterStatus = useCallback(
    (event) => {
      const selectedStatus = event.target.value;
      updateFilters({ status: selectedStatus });
      onResetPage();
    },
    [updateFilters, onResetPage]
  );

  const statusOptions = [
    { label: "All", value: "" },
    { label: "Pending Signature", value: "pending_signature" },
    { label: "Signed", value: "signed" },
    { label: "Rejected", value: "rejected" },
  ];

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        gap: { xs: 1.5, sm: 2 },
        alignItems: { xs: "stretch", sm: "flex-end" },
        p: { xs: 2, sm: 2.5 },
        flexWrap: "wrap",
      }}
    >
      <TextField
        select
        size="small"
        label="Select Vacancy"
        value={currentFilters.vacancy_id || ""}
        onChange={handleFilterVacancy}
        sx={{
          width: { xs: "100%", sm: "auto" },
          minWidth: { sm: 200, md: 250 },
          flex: { xs: "1", sm: "initial" },
        }}
      >
        <MenuItem value="">All</MenuItem>
        {appliedVacancyLoading ? (
          <MenuItem disabled>
            <CircularProgress size={20} />
          </MenuItem>
        ) : (
          vacancyList?.map((vacancy) => (
            <MenuItem key={vacancy.id} value={vacancy.id}>
              {vacancy.title} - {vacancy.employer_name}
            </MenuItem>
          ))
        )}
      </TextField>

      <TextField
        select
        size="small"
        label="Status"
        value={currentFilters.status || ""}
        onChange={handleFilterStatus}
        sx={{
          width: { xs: "100%", sm: "auto" },
          minWidth: { sm: 180, md: 200 },
          flex: { xs: "1", sm: "initial" },
        }}
      >
        {statusOptions.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </TextField>
    </Box>
  );
}
