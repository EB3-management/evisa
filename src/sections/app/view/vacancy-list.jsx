import { useState, useCallback } from "react";
import {
  Box,
  Stack,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  Typography,
  Pagination,
  CircularProgress,
} from "@mui/material";
import { Iconify } from "src/components/iconify";
import { VacancyItem } from "./vacancy-item";

export function VacancyList({ 
  vacancyList, 
  countryList = [], 
  selectedCountry,
  selectedVisaCategory,
  onCountryChange,
  onVisaCategoryChange,
  isLoading = false
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  const handleSearchChange = useCallback((event) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1);
  }, []);

  const handleCountryChange = useCallback((event) => {
    onCountryChange(event.target.value);
    onVisaCategoryChange("all"); // Reset visa category when country changes
    setCurrentPage(1);
  }, [onCountryChange, onVisaCategoryChange]);

  const handleVisaCategoryChange = useCallback((event) => {
    onVisaCategoryChange(event.target.value);
    setCurrentPage(1);
  }, [onVisaCategoryChange]);

  const handlePageChange = useCallback((event, page) => {
    setCurrentPage(page);
  }, []);

  // Get visa categories for selected country
  const availableVisaCategories =
    selectedCountry === "all"
      ? []
      : countryList.find((country) => country.id === selectedCountry)
          ?.visa_categories || [];

  // Filter logic - API handles country/visa filtering, only search query is client-side
  const filteredJobs = vacancyList.filter((job) => {
    const matchesSearch =
      job.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  // Pagination
  const totalPages = Math.ceil(filteredJobs.length / itemsPerPage);
  const paginatedJobs = filteredJobs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <Stack spacing={3}>
      {/* Search and Filters */}
      <Stack
        spacing={2}
        direction={{ xs: "column", sm: "row" }}
        alignItems={{ xs: "stretch", sm: "center" }}
        justifyContent="space-between"
      >
        <TextField
          fullWidth
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search jobs..."
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Iconify
                  icon="eva:search-fill"
                  sx={{ color: "text.disabled" }}
                />
              </InputAdornment>
            ),
          }}
          sx={{ maxWidth: { sm: 360 } }}
        />

        <Stack direction="row" spacing={1} sx={{ minWidth: { sm: "auto" } }}>
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <Select value={selectedCountry} onChange={handleCountryChange}>
              <MenuItem value="all">All Countries</MenuItem>
              {countryList.map((country) => (
                <MenuItem key={country.id} value={country.id}>
                  {country.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl
            size="small"
            sx={{ minWidth: 140 }}
            disabled={selectedCountry === "all"}
          >
            <Select
              value={selectedVisaCategory}
              onChange={handleVisaCategoryChange}
            >
              <MenuItem value="all">All Visa Types</MenuItem>
              {availableVisaCategories.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
      </Stack>

      {/* Results count */}
      <Typography variant="body2" sx={{ color: "text.secondary" }}>
        {filteredJobs.length} jobs found
      </Typography>

      {/* Job Grid */}
      {isLoading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "400px",
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <Box
          sx={{
            gap: 3,
            display: "grid",
            gridTemplateColumns: {
              xs: "repeat(1, 1fr)",
              sm: "repeat(2, 1fr)",
              md: "repeat(3, 1fr)",
            },
          }}
        >
          {paginatedJobs.map((job) => (
            <VacancyItem key={job.id} job={job} />
          ))}
        </Box>
      )}

      {/* Empty State */}
      {!isLoading && filteredJobs.length === 0 && (
        <Box sx={{ textAlign: "center", py: 8 }}>
          <Typography variant="h6" color="text.secondary">
            No jobs found
          </Typography>
          <Typography variant="body2" color="text.disabled" sx={{ mt: 1 }}>
            Try adjusting your search or filters
          </Typography>
        </Box>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
            shape="rounded"
          />
        </Box>
      )}
    </Stack>
  );
}
