import { Card, CardContent, Typography, Box } from "@mui/material";
import Grid from "@mui/material/Grid2";

/**
 * VacancyDetailsCard component
 * Displays vacancy information in a card format
 * @param {Object} vacancyDetail - Vacancy details object
 */
export const VacancyDetailsCard = ({ vacancyDetail }) => {
  if (!vacancyDetail) return null;

  return (
    <Card
      sx={{
        mb: 2,
        backgroundColor: "primary.main",
        color: "white",
        boxShadow: 2,
      }}
    >
      <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
        <Grid container spacing={2} alignItems="center">
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Box>
              <Typography
                variant="caption"
                sx={{
                  opacity: 0.8,
                  textTransform: "uppercase",
                  fontSize: "0.7rem",
                  display: "block",
                }}
              >
                Position
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 600, mt: 0.5 }}>
                {vacancyDetail?.title || "N/A"}
              </Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Box>
              <Typography
                variant="caption"
                sx={{
                  opacity: 0.8,
                  textTransform: "uppercase",
                  fontSize: "0.7rem",
                  display: "block",
                }}
              >
                Location
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 600, mt: 0.5 }}>
                {vacancyDetail?.location || "N/A"}
              </Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Box>
              <Typography
                variant="caption"
                sx={{
                  opacity: 0.8,
                  textTransform: "uppercase",
                  fontSize: "0.7rem",
                  display: "block",
                }}
              >
                Country
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 600,
                  mt: 0.5,
                  textTransform: "capitalize",
                }}
              >
                {vacancyDetail?.visa_category?.country?.name || "N/A"}
              </Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Box>
              <Typography
                variant="caption"
                sx={{
                  opacity: 0.8,
                  textTransform: "uppercase",
                  fontSize: "0.7rem",
                  display: "block",
                }}
              >
                Category
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 600, mt: 0.5 }}>
                {vacancyDetail?.visa_category?.name || "N/A"}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};
