import { usePopover } from "minimal-shared/hooks";

import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Card from "@mui/material/Card";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import MenuList from "@mui/material/MenuList";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import ListItemText from "@mui/material/ListItemText";
import Chip from "@mui/material/Chip";

import { RouterLink } from "src/routes/components";

import { fDate, fDateTime } from "src/utils/format-time";
import { fCurrency } from "src/utils/format-number";

import { Iconify } from "src/components/iconify";
import { CustomPopover } from "src/components/custom-popover";
import { Button } from "@mui/material";
import { paths } from "src/routes/paths";
import { useRouter } from "src/routes/hooks";
import { DashboardContent } from "src/layouts/dashboard";
import { assignPlan } from "src/api/plan";
import { toast } from "sonner";

// ----------------------------------------------------------------------

export function PlanItem({ job, selectedVacancyId, sx, ...other }) {
  const router = useRouter();
  console.log("this is sele", job.id);

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
        bgcolor: "#D2F3EE",
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
          <Typography variant="caption" sx={{ color: "#4F8E88" }}>
            Total Fee
          </Typography>
          <Typography variant="h4" sx={{ color: "#2BA597", fontWeight: 700 }}>
            {fCurrency(job.total_fee)} {job.currency}
          </Typography>
        </Box>
        <Box sx={{ textAlign: "right" }}>
          <Typography variant="caption" sx={{ color: "#4F8E88" }}>
            Installments
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 600, color: "#114B46" }}>
            {job.installment_count} payments
          </Typography>
        </Box>
      </Box>
    </Box>
  );

  const renderInstallments = () => {
    let installments = [];
    try {
      const schedule = JSON.parse(job.installment_schedule);
      installments = schedule.installments || [];
    } catch (error) {
      console.error("Failed to parse installment schedule:", error);
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
          {installments.slice(0, 3).map((installment, index) => (
            <Box
              key={index}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
              }}
            >
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  bgcolor: "#D2F3EE",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <Typography
                  variant="caption"
                  fontWeight={600}
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
                    mb: 0.5,
                  }}
                >
                  <Typography
                    variant="body2"
                    fontWeight={500}
                    sx={{ color: "#114B46" }}
                  >
                    {fCurrency(installment.amount)} {job.currency}
                  </Typography>
                  <Typography variant="caption" sx={{ color: "#4F8E88" }}>
                    {installment.due_after_days === 0
                      ? "Due now"
                      : `After ${installment.due_after_days} days`}
                  </Typography>
                </Box>
                <Typography
                  variant="caption"
                  sx={{
                    color: "#4F8E88",
                    display: "-webkit-box",
                    WebkitLineClamp: 1,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
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
      await assignPlan(selectedVacancyId, {
        finance_plan_id: job.id,
      });

      console.log("Selected Vacancy ID:", selectedVacancyId);
      console.log("Plan ID:", job.id);

      toast.success("Plan assigned successfully!");
      router.push(paths.dashboard.finance);
    } catch (error) {
      const backendMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to assign plan";

      toast.error(backendMessage);
      console.error("Assign Plan Error:", error);
    }
  };

  const renderAction = () => (
    <Box sx={{ p: 3, pt: 2 }}>
      <Button
        fullWidth
        variant="contained"
        size="large"
        endIcon={<Iconify icon="solar:arrow-right-linear" />}
        onClick={handleClick}
        sx={{
          bgcolor: "#2BA597",
          color: "#ffffff",
          borderRadius: 1.5,
          textTransform: "none",
          fontWeight: 600,
          py: 1.5,
          boxShadow: "0 4px 12px rgba(43, 165, 151, 0.24)",

          "&:hover": {
            bgcolor: "#1D7E73",
            boxShadow: "0 8px 24px rgba(43, 165, 151, 0.32)",
          },
        }}
      >
        Select This Plan
      </Button>
    </Box>
  );

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
          "&:hover": {
            boxShadow: "0 12px 32px rgba(43, 165, 151, 0.16)",
            transform: "translateY(-4px)",
            borderColor: "#5DC8B9",
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
