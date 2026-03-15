
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";

import { fDateTime } from "src/utils/format-time";
import { fCurrency } from "src/utils/format-number";

import { Iconify } from "src/components/iconify";
import { Button, CircularProgress } from "@mui/material";
import { paths } from "src/routes/paths";
import { useRouter } from "src/routes/hooks";
import { DashboardContent } from "src/layouts/dashboard";
import { assignPlan } from "src/api/plan";
import { applyVacancy } from "src/api/vacancy";
import { toast } from "sonner";
import { useState } from "react";

// ----------------------------------------------------------------------

export function PlanItem({
  job,
  selectedVacancyId,
  hasAssignedPlan,
  sx,
  ...other
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  console.log("this is sele", job);

  const renderHeader = () => (
    <Box
      sx={{
        p: 3,
        pb: 2,
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-between",
      }}
    >
      <Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
          <Chip
            label={job.visa_type}
            size="small"
            sx={{
              bgcolor: "#2BA597",
              color: "white",
              fontWeight: 600,
              fontSize: 12,
            }}
          />
          <Chip
            label={job.status}
            size="small"
            sx={{
              bgcolor: job.status === "active" ? "#5DC8B9" : "#CDE2E0",
              color: job.status === "active" ? "#ffffff" : "#114B46",
              textTransform: "capitalize",
              fontWeight: 500,
            }}
          />

          {job.assigned && (
            <Chip
              label="Assigned"
              size="small"
              icon={<Iconify icon="mdi:check-circle" width={16} />}
              sx={{
                bgcolor: "#22C55E",
                color: "white",
                fontWeight: 600,
                fontSize: 12,
              }}
            />
          )}
        </Box>
        <Typography
          variant="h6"
          sx={{ fontWeight: 600, mb: 0.5, color: "#114B46" }}
        >
          {job.plan_name}
        </Typography>
        <Typography variant="caption" sx={{ color: "#4F8E88" }}>
          Updated: {fDateTime(job.updated_at)}
        </Typography>
      </Box>
    </Box>
  );

  const renderDescription = () => (
    <Box sx={{ px: 3, pb: 2 }}>
      <Typography
        variant="body2"
        sx={{
          color: "#4F8E88",
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}
      >
        {job.description}
      </Typography>
    </Box>
  );

  const renderPricing = () => (
    <Box
      sx={{
        px: 3,
        py: 2,
        bgcolor: "primary.lighter",
        borderTop: 1,
        borderBottom: 1,
        borderColor: "#CDE2E0",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box>
          <Typography variant="caption" sx={{ color: "primary.main" }}>
            Total Fee
          </Typography>
          <Typography
            variant="h4"
            sx={{ color: "secondary.dark", fontWeight: 700 }}
          >
            {fCurrency(job.total_fee)} {job.currency}
          </Typography>
        </Box>
        <Box sx={{ textAlign: "right" }}>
          <Typography variant="caption" sx={{ color: "primary.main" }}>
            Installments
          </Typography>
          <Typography
            variant="h6"
            sx={{ fontWeight: 600, color: "primary.dark" }}
          >
            {job.installment_count} payments
          </Typography>
        </Box>
      </Box>
    </Box>
  );

  const renderInstallments = () => {
    // Get installments directly from the API response
    const installments = job.installments || [];

    if (installments.length === 0) {
      return null;
    }

    return (
      <Box sx={{ px: 3, py: 2 }}>
        <Typography
          variant="subtitle2"
          sx={{ mb: 1.5, fontWeight: 600, color: "#114B46" }}
        >
          Payment Schedule
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
          {installments.map((installment, index) => (
            <Box
              key={index}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                p: 1.5,
                borderRadius: 1,
                bgcolor: "#F7FDFC",
                border: "1px solid #D2F3EE",
              }}
            >
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  bgcolor: "#D2F3EE",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <Typography
                  variant="body2"
                  fontWeight={700}
                  sx={{ color: "#2BA597" }}
                >
                  {installment.installment_no}
                </Typography>
              </Box>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 0.5,
                  }}
                >
                  <Typography
                    variant="body2"
                    fontWeight={600}
                    sx={{ color: "#114B46" }}
                  >
                    {fCurrency(installment.amount)} {job.currency}
                  </Typography>
                  <Chip
                    label={
                      installment.due_after_days === 0
                        ? "Due now"
                        : `After ${installment.due_after_days} days`
                    }
                    size="small"
                    sx={{
                      bgcolor:
                        installment.due_after_days === 0
                          ? "#FF9F43"
                          : "#5DC8B9",
                      color: "white",
                      fontWeight: 500,
                      fontSize: 11,
                      height: 22,
                    }}
                  />
                </Box>
                <Typography
                  variant="caption"
                  sx={{
                    color: "#4F8E88",
                    display: "block",
                    lineHeight: 1.4,
                  }}
                >
                  {installment.description}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    );
  };

  const handleClick = async () => {
    try {
      // ✅ SCENARIO 1: If a plan is already assigned
      if (hasAssignedPlan) {
        // Only allow clicking the assigned plan
        if (job.assigned) {
          // Navigate to contract page
          router.push(paths.dashboard.contract.root);
          return;
        } else {
          // Disable other plans
          toast.info("A plan is already assigned. Please proceed to contract.");
          return;
        }
      }

      // ✅ Start loading
      setIsLoading(true);

      // ✅ SCENARIO 2: No plan is assigned yet - call applyVacancy API first
      console.log("📤 Calling applyVacancy API...");
      const applyResponse = await applyVacancy(selectedVacancyId);

      console.log("✅ Apply Vacancy Response:", applyResponse);

      // Show success message from applyVacancy
      if (applyResponse?.message) {
        toast.success(applyResponse.message);
      }

      // After successful apply, assign the selected plan
      console.log("📤 Assigning plan...");
      const assignResponse = await assignPlan(selectedVacancyId, {
        finance_plan_id: job.id,
      });

      console.log("Selected Vacancy ID:", selectedVacancyId);
      console.log("Plan ID:", job.id);
      console.log("✅ Assign Plan Response:", assignResponse);

      // Show success message from assignPlan
      toast.success("Plan assigned successfully!");

      // Navigate to contract page
      router.push(paths.dashboard.contract.root);
    } catch (error) {
      const backendMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to process request";

      toast.error(backendMessage);
      console.error("Error:", error);
    } finally {
      // ✅ Stop loading
      setIsLoading(false);
    }
  };

  const renderAction = () => {
    // ✅ Determine if this plan should be disabled
    const isDisabled = hasAssignedPlan && !job.assigned;

    return (
      <Box sx={{ p: 3, pt: 2 }}>
        <Button
          fullWidth
          variant="contained"
          size="large"
          onClick={handleClick}
          disabled={isDisabled || isLoading}
          startIcon={
            isLoading ? (
              <CircularProgress size={20} sx={{ color: "white" }} />
            ) : job.assigned ? (
              <Iconify icon="mdi:check-circle" />
            ) : null
          }
          endIcon={
            !job.assigned && !isLoading ? (
              <Iconify icon="solar:arrow-right-linear" />
            ) : null
          }
          sx={{
            bgcolor: job.assigned ? "#22C55E" : "#2BA597",
            color: "#ffffff",
            borderRadius: 1.5,
            textTransform: "none",
            fontWeight: 600,
            py: 1.5,
            boxShadow: job.assigned
              ? "0 4px 12px rgba(34, 197, 94, 0.24)"
              : "0 4px 12px rgba(43, 165, 151, 0.24)",

            "&:hover": {
              bgcolor: job.assigned ? "#22C55E" : "#1D7E73",
              boxShadow: job.assigned
                ? "0 4px 12px rgba(34, 197, 94, 0.24)"
                : "0 8px 24px rgba(43, 165, 151, 0.32)",
            },
            "&.Mui-disabled": {
              bgcolor: "#e0e0e0",
              color: "#9e9e9e",
              opacity: 0.6,
            },
          }}
        >
          {isLoading
            ? "Processing..."
            : job.assigned
            ? "View Contract"
            : "Select This Plan"}
        </Button>
      </Box>
    );
  };

  return (
    <DashboardContent>
      <Card
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          bgcolor: "#ffffff",
          border: "1px solid #D2F3EE",
          transition: "all 0.3s ease-in-out",
          opacity: hasAssignedPlan && !job.assigned ? 0.5 : 1,
          "&:hover": {
            boxShadow: "0 12px 32px rgba(43, 165, 151, 0.16)",
            transform:
              job.assigned || (hasAssignedPlan && !job.assigned)
                ? "none"
                : "translateY(-4px)",
            borderColor: job.assigned ? "#22C55E" : "#5DC8B9",
          },
          ...sx,
        }}
        {...other}
      >
        {renderHeader()}
        {renderDescription()}
        {renderPricing()}
        {renderInstallments()}
        <Box sx={{ flexGrow: 1 }} />
        {renderAction()}
      </Card>
    </DashboardContent>
  );
}
