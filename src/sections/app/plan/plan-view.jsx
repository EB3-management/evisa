import {
  Box,
  Typography,
  CircularProgress,
} from "@mui/material";
import { useGetPlan } from "src/api/plan";
import { PlanItem } from "./plan-item";
import { DashboardContent } from "src/layouts/dashboard";
import { useAppSelector } from "src/redux/hooks";
import { CustomBreadcrumbs } from "src/components/custom-breadcrumbs";
import { paths } from "src/routes/paths";

export function PlanList({ id }) {
  const selectedVacancyId = useAppSelector(
    (state) => state.vacancy.selectedVacancyId
  );
  const { plan, planLoading } = useGetPlan(selectedVacancyId);
  console.log("Selected Vacancy ID:", selectedVacancyId);
  console.log("this is vacancy id", id, selectedVacancyId);

  // ✅ Check if plan data exists
  const hasPlans = plan && Array.isArray(plan) && plan.length > 0;

  // ✅ Check if any plan is already assigned
  const hasAssignedPlan = hasPlans && plan.some((p) => p.assigned === true);

  return (
    <DashboardContent>
        <CustomBreadcrumbs
          links={[
            { name: "Dashboard", href: paths.dashboard.root },
            {
              name: "Plan",
              href: paths.dashboard.plan(selectedVacancyId),
            },
            { name: "List" },
          ]}
          sx={{ mb: { xs: 3, md: 5 } }}
        />
        {planLoading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "400px",
              width: "100%",
            }}
          >
            <CircularProgress />
          </Box>
        ) : !hasPlans ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "400px",
              width: "100%",
            }}
          >
            <Box sx={{ textAlign: "center" }}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No Available Plans
              </Typography>
              <Typography variant="body2" color="text.disabled">
                There are currently no finance plans available for this vacancy.
              </Typography>
            </Box>
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
            {plan.map((job) => (
              <PlanItem
                key={job.id}
                job={job}
                selectedVacancyId={selectedVacancyId}
                hasAssignedPlan={hasAssignedPlan}
                // editHref={paths.dashboard.job.edit(job.id)}
                // detailsHref={paths.dashboard.job.details(job.id)}
                // onDelete={() => handleDelete(job.id)}
              />
            ))}
          </Box>
        )}
      </DashboardContent>
  );
}
