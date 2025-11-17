import {
  Box,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { useGetVacancy } from "src/api/vacancy";
import { Iconify } from "src/components/iconify";
import { z } from "zod";

// ✅ Step-specific Zod schema (kept for consistency)
// Fields are optional since they're auto-filled from vacancy detail
export const sponsorInformationSchema = z.object({
  sponsor_name: z.string().default(""),
  sponsor_position: z.string().default(""),
  sponsor_location: z.string().default(""),
  selected_vacancy_id: z.number().optional(),
});

export const SponsorInformation = () => {
  const { vacancy, vacancyLoading } = useGetVacancy();
  const [selectedVacancyId, setSelectedVacancyId] = useState("");
  const [selectedVacancy, setSelectedVacancy] = useState(null);

  const {
    setValue,
    formState: { errors },
  } = useFormContext();

  // ✅ Set the first applied vacancy as default on load
  useEffect(() => {
    if (vacancy && vacancy.length > 0 && !selectedVacancyId) {
      const firstVacancy = vacancy[0];
      setSelectedVacancyId(firstVacancy.id);
      setSelectedVacancy(firstVacancy);
    }
  }, [vacancy, selectedVacancyId]);

  // ✅ Prefill form values from selected vacancy
  useEffect(() => {
    if (selectedVacancy) {
      setValue("sponsor_name", selectedVacancy.employer_name || "");
      setValue("sponsor_position", selectedVacancy.title || "");
      setValue("sponsor_location", selectedVacancy.location || "");
      setValue("selected_vacancy_id", selectedVacancy.id);
    }
  }, [selectedVacancy, setValue]);

  // ✅ Handle vacancy selection change
  const handleVacancyChange = (event) => {
    const vacancyId = event.target.value;
    setSelectedVacancyId(vacancyId);

    const selectedVac = vacancy.find((v) => v.id === vacancyId);
    setSelectedVacancy(selectedVac);
  };

  return (
    <Box id="section-3" sx={{ mb: 6 }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
        Sponsor Information
      </Typography>

      <Grid container spacing={3}>
        {/* Vacancy Selection Dropdown */}
        <Grid size={{ xs: 12 }}>
          <FormControl fullWidth>
            <InputLabel id="vacancy-select-label">
              Select Vacancy
            </InputLabel>
            <Select
              labelId="vacancy-select-label"
              id="vacancy-select"
              value={selectedVacancyId}
              label="Select Vacancy"
              onChange={handleVacancyChange}
              disabled={vacancyLoading || !vacancy?.length}
            >
              {vacancy?.map((vac) => (
                <MenuItem key={vac.id} value={vac.id}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Iconify icon="mdi:briefcase" width={20} />
                    <Typography variant="body2">
                      {vac.title} - {vac.employer_name} ({vac.location})
                    </Typography>
                  </Stack>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Sponsor Name */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <Typography sx={{ mb: 1 }}>Sponsor Name</Typography>
          <TextField
            fullWidth
            value={selectedVacancy?.employer_name || ""}
            InputProps={{ readOnly: true }}
            sx={{
              "& .MuiOutlinedInput-root": { backgroundColor: "#f5f5f5" },
            }}
          />
          {errors.sponsor_name && (
            <Typography color="error" variant="caption">
              {errors.sponsor_name.message}
            </Typography>
          )}
        </Grid>

        {/* Sponsor Position */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <Typography sx={{ mb: 1 }}>Sponsor Position</Typography>
          <TextField
            fullWidth
            value={selectedVacancy?.title || ""}
            InputProps={{ readOnly: true }}
            sx={{
              "& .MuiOutlinedInput-root": { backgroundColor: "#f5f5f5" },
            }}
          />
          {errors.sponsor_position && (
            <Typography color="error" variant="caption">
              {errors.sponsor_position.message}
            </Typography>
          )}
        </Grid>

        {/* Sponsor Location */}
        <Grid size={{ xs: 12 }}>
          <Typography sx={{ mb: 1 }}>Sponsor Location</Typography>
          <TextField
            fullWidth
            value={selectedVacancy?.location || ""}
            InputProps={{ readOnly: true }}
            sx={{
              "& .MuiOutlinedInput-root": { backgroundColor: "#f5f5f5" },
            }}
          />
          {errors.sponsor_location && (
            <Typography color="error" variant="caption">
              {errors.sponsor_location.message}
            </Typography>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};
