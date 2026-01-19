import {
  Box,
  Typography,
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormHelperText,
  MenuItem,
  Select,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useFormContext, Controller, useWatch } from "react-hook-form";
import { z } from "zod";

const yesNoOptions = ["Yes", "No"];

// Academic levels
const academicLevels = [
  { key: "lowerSchool", label: "Lower School" },
  { key: "highSchool", label: "High School" },
  { key: "bachelor", label: "Bachelor" },
  { key: "graduate", label: "Graduate" },
  { key: "doctorate", label: "Doctorate" },
];

// ✅ Complete schema with conditional validation
// ✅ Conditional academic schema
export const academicInformationSchema = z
  .object({
    hasFormalEducation: z.boolean().default(false),
    ...Object.fromEntries(
      academicLevels.flatMap(({ key }) => [
        // yes/no field
        [
          key,
          z
            .string()
            .default("No")
            .transform((val) => val.toLowerCase()),
        ],
        // optional extra fields (conditionally required)
        [`${key}_instituteName`, z.string().optional()],
        [`${key}_graduationYear`, z.string().optional()],
        [`${key}_country`, z.string().optional()],
        [`${key}_state`, z.string().optional()],
        [`${key}_city`, z.string().optional()],
        [`${key}_zipCode`, z.string().optional()],
        [`${key}_address`, z.string().optional()],
        // Add grade field for lower school only
        ...(key === "lowerSchool"
          ? [["lowerSchool_grade", z.string().optional()]]
          : []),
      ]),
    ),
  })
  .superRefine((data, ctx) => {
    // Only validate academic levels if user has formal education
    if (data.hasFormalEducation === true) {
      academicLevels.forEach(({ key }) => {
        const isYes = data[key] === "yes";

        if (isYes) {
          const requiredFields = [
            `${key}_instituteName`,
            `${key}_graduationYear`,
            `${key}_country`,
            `${key}_state`,
            `${key}_city`,
            `${key}_address`,
          ];

          // Add grade field validation for lower school
          if (key === "lowerSchool") {
            requiredFields.push(`${key}_grade`);
          }

          requiredFields.forEach((field) => {
            if (!data[field] || data[field].toString().trim() === "") {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: `${field
                  .replace(`${key}_`, "")
                  .replace(/([A-Z])/g, " $1")} is required`,
                path: [field],
              });
            }
          });

          // Validate graduation year
          const year = data[`${key}_graduationYear`];
          if (year && !/^\d{4}$/.test(year)) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: "Must be a valid 4-digit year",
              path: [`${key}_graduationYear`],
            });
          }
        }
      });
    }
  });

export const AcademicInformation = ({ country }) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  // Watch the main question
  const hasFormalEducation = useWatch({
    control,
    name: "hasFormalEducation",
  });

  // Watch all academic level responses
  const watchedLevels = useWatch({
    control,
    name: academicLevels.map((level) => level.key),
  });

  // Reusable fields component
  const renderExtraFields = (levelKey) => (
    <>
      {/* Row 1: Institute Name and Graduation Year */}
      <Grid size={{ xs: 12, sm: 6 }}>
        <Typography sx={{ mb: 1 }}>Name of Institute </Typography>
        <Controller
          name={`${levelKey}_instituteName`}
          control={control}
          defaultValue=""
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              placeholder="Enter institute name"
              error={!!errors[`${levelKey}_instituteName`]}
              helperText={errors[`${levelKey}_instituteName`]?.message}
              sx={{ "& .MuiOutlinedInput-root": { backgroundColor: "#fff" } }}
            />
          )}
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 6 }}>
        <Typography sx={{ mb: 1 }}>Year of Graduation </Typography>
        <Controller
          name={`${levelKey}_graduationYear`}
          control={control}
          defaultValue=""
          render={({ field }) => (
            <TextField
              {...field}
              type="number"
              fullWidth
              placeholder="YYYY"
              error={!!errors[`${levelKey}_graduationYear`]}
              helperText={errors[`${levelKey}_graduationYear`]?.message}
              sx={{ "& .MuiOutlinedInput-root": { backgroundColor: "#fff" } }}
            />
          )}
        />
      </Grid>

      {/* Add Grade field for Lower School only */}
      {levelKey === "lowerSchool" && (
        <Grid size={{ xs: 12, sm: 6 }}>
          <Typography sx={{ mb: 1 }}>Grade </Typography>
          <Controller
            name="lowerSchool_grade"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                placeholder="Enter grade"
                error={!!errors.lowerSchool_grade}
                helperText={errors.lowerSchool_grade?.message}
                sx={{ "& .MuiOutlinedInput-root": { backgroundColor: "#fff" } }}
              />
            )}
          />
        </Grid>
      )}

      {/* Row 2: Country, State, City */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <Typography sx={{ mb: 1 }}>Country </Typography>
        <Controller
          name={`${levelKey}_country`}
          control={control}
          defaultValue=""
          render={({ field }) => (
            <FormControl fullWidth error={!!errors[`${levelKey}_country`]}>
              <Select {...field} displayEmpty sx={{ backgroundColor: "#fff" }}>
                <MenuItem value="">
                  <em>Select Country</em>
                </MenuItem>
                {country?.map((option) => (
                  <MenuItem key={option.value} value={String(option.value)}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
              {errors[`${levelKey}_country`] && (
                <FormHelperText>
                  {errors[`${levelKey}_country`].message}
                </FormHelperText>
              )}
            </FormControl>
          )}
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <Typography sx={{ mb: 1 }}>State </Typography>
        <Controller
          name={`${levelKey}_state`}
          control={control}
          defaultValue=""
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              placeholder="Enter state"
              error={!!errors[`${levelKey}_state`]}
              helperText={errors[`${levelKey}_state`]?.message}
              sx={{ "& .MuiOutlinedInput-root": { backgroundColor: "#fff" } }}
            />
          )}
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <Typography sx={{ mb: 1 }}>City </Typography>
        <Controller
          name={`${levelKey}_city`}
          control={control}
          defaultValue=""
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              placeholder="Enter city"
              error={!!errors[`${levelKey}_city`]}
              helperText={errors[`${levelKey}_city`]?.message}
              sx={{ "& .MuiOutlinedInput-root": { backgroundColor: "#fff" } }}
            />
          )}
        />
      </Grid>

      {/* Row 3: Zip Code and Address */}
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <Typography sx={{ mb: 1 }}>Zip Code</Typography>
        <Controller
          name={`${levelKey}_zipCode`}
          control={control}
          defaultValue=""
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              placeholder="Enter zip code"
              error={!!errors[`${levelKey}_zipCode`]}
              helperText={errors[`${levelKey}_zipCode`]?.message}
              sx={{ "& .MuiOutlinedInput-root": { backgroundColor: "#fff" } }}
            />
          )}
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 12, md: 8 }}>
        <Typography sx={{ mb: 1 }}>Address </Typography>
        <Controller
          name={`${levelKey}_address`}
          control={control}
          defaultValue=""
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              multiline
              rows={2}
              placeholder="Enter full address"
              error={!!errors[`${levelKey}_address`]}
              helperText={errors[`${levelKey}_address`]?.message}
              sx={{ "& .MuiOutlinedInput-root": { backgroundColor: "#fff" } }}
            />
          )}
        />
      </Grid>
    </>
  );

  return (
    <Box id="section-4" sx={{ mb: 6 }}>
      {/* <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
        Academic Information
      </Typography> */}

      {/* First Question: Do you have formal education? */}
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12 }}>
            <Typography sx={{ mb: 1, fontWeight: 500 }}>
              Do you have any formal education background?
            </Typography>
            <Controller
              name="hasFormalEducation"
              control={control}
              defaultValue={false}
              render={({ field }) => (
                <FormControl
                  component="fieldset"
                  error={!!errors.hasFormalEducation}
                >
                  <RadioGroup
                    row
                    sx={{ gap: { xs: 2, sm: 3 } }}
                    value={field.value ? "Yes" : "No"}
                    onChange={(e) => field.onChange(e.target.value === "Yes")}
                  >
                    <FormControlLabel
                      value="Yes"
                      control={
                        <Radio
                          sx={{
                            color: "secondary.main",
                            "&.Mui-checked": {
                              color: "secondary.main",
                            },
                          }}
                        />
                      }
                      label="Yes"
                    />
                    <FormControlLabel
                      value="No"
                      control={
                        <Radio
                          sx={{
                            color: "secondary.main",
                            "&.Mui-checked": {
                              color: "secondary.main",
                            },
                          }}
                        />
                      }
                      label="No"
                    />
                  </RadioGroup>
                  {errors.hasFormalEducation && (
                    <FormHelperText>
                      {errors.hasFormalEducation?.message}
                    </FormHelperText>
                  )}
                </FormControl>
              )}
            />
          </Grid>
        </Grid>
      </Box>

      {/* Show academic levels only if Yes */}
      {hasFormalEducation === true && (
        <>
          {academicLevels.map((level, index) => (
            <Box key={level.key} sx={{ mb: 4 }}>
              {/* Radio buttons for each level */}
              <Grid container spacing={3}>
                <Grid size={{ xs: 12 }}>
                  <Typography sx={{ mb: 1, fontWeight: 500 }}>
                    {level.label}
                  </Typography>
                  <Controller
                    name={level.key}
                    control={control}
                    defaultValue="no"
                    render={({ field }) => (
                      <FormControl
                        component="fieldset"
                        error={!!errors[level.key]}
                      >
                        <RadioGroup
                          {...field}
                          row
                          sx={{ gap: { xs: 2, sm: 3 } }}
                        >
                          {yesNoOptions.map((option) => (
                            <FormControlLabel
                              key={option}
                              value={option}
                              control={
                                <Radio
                                  sx={{
                                    color: "secondary.main",
                                    "&.Mui-checked": {
                                      color: "secondary.main",
                                    },
                                  }}
                                />
                              }
                              label={option}
                            />
                          ))}
                        </RadioGroup>
                        {errors[level.key] && (
                          <FormHelperText>
                            {errors[level.key]?.message}
                          </FormHelperText>
                        )}
                      </FormControl>
                    )}
                  />
                </Grid>
              </Grid>

              {/* Conditionally render fields if Yes */}
              {watchedLevels[index] === "Yes" && (
                <Grid container spacing={3} sx={{ mt: 2 }}>
                  {renderExtraFields(level.key)}
                </Grid>
              )}
            </Box>
          ))}
        </>
      )}
    </Box>
  );
};
