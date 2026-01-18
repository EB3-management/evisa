import {
  Box,
  Typography,
  TextField,
  MenuItem,
  FormControl,
  FormHelperText,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useFormContext, Controller } from "react-hook-form";
import { z } from "zod";

const levels = ["Advanced", "Intermediate", "Basic", "None"];

// ✅ Zod validation schema
export const englishLanguageProficiencySchema = z.object({
  writing: z.enum(["Advanced", "Intermediate", "Basic", "None"], {
    errorMap: () => ({ message: "Please select a writing proficiency level" }),
  }),
  listening: z.enum(["Advanced", "Intermediate", "Basic", "None"], {
    errorMap: () => ({
      message: "Please select a listening proficiency level",
    }),
  }),
  reading: z.enum(["Advanced", "Intermediate", "Basic", "None"], {
    errorMap: () => ({ message: "Please select a reading proficiency level" }),
  }),
  speaking: z.enum(["Advanced", "Intermediate", "Basic", "None"], {
    errorMap: () => ({ message: "Please select a speaking proficiency level" }),
  }),
});

export const EnglishLanguageProficiency = () => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const skills = [
    { key: "writing", label: "Writing" },
    { key: "listening", label: "Listening" },
    { key: "reading", label: "Reading" },
    { key: "speaking", label: "Speaking" },
  ];

  return (
    <Box id="section-5" sx={{ mb: 6 }}>
      {/* <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
        English Language Proficiency
      </Typography> */}

      <Grid container spacing={3}>
        {skills.map((skill) => (
          <Grid size={{ xs: 12, sm: 6 }} key={skill.key}>
            <Typography sx={{ mb: 1 }}>
              {skill.label} 
            </Typography>
            <Controller
              name={skill.key}
              control={control}
              defaultValue=""
              render={({ field }) => (
                <FormControl fullWidth error={!!errors[skill.key]}>
                  <TextField
                    {...field}
                    select
                    fullWidth
                    placeholder={`Select ${skill.label} level`}
                    error={!!errors[skill.key]}
                    sx={{
                      "& .MuiOutlinedInput-root": { backgroundColor: "#fff" },
                    }}
                  >
                    <MenuItem value="">
                      <em>Select level</em>
                    </MenuItem>
                    {levels.map((level) => (
                      <MenuItem key={level} value={level}>
                        {level}
                      </MenuItem>
                    ))}
                  </TextField>
                  {errors[skill.key] && (
                    <FormHelperText>
                      {errors[skill.key]?.message}
                    </FormHelperText>
                  )}
                </FormControl>
              )}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};
