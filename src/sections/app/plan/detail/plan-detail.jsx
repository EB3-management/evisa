import { useState, useEffect } from "react";
import {
  Box,
  Card,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Divider,
  Grid2 as Grid,
  Chip,
  Paper,
} from "@mui/material";
import { Iconify } from "src/components/iconify";
import { fDate } from "src/utils/format-time";
import { fCurrency } from "src/utils/format-number";
import { useGetAssignPlanShow } from "src/api/plan";
import { Markdown } from "src/components/markdown";

export function PlanDetail({ id }) {
  const { planShow, planShowLoading, planShowError } = useGetAssignPlanShow(id);

  console.log("Plan Show Data:", planShow); // Debug log

  if (planShowLoading) {
    return (
      <Box
        sx={{
          p: 3,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: 300,
        }}
      >
        <Typography>Loading plan details...</Typography>
      </Box>
    );
  }

  if (planShowError) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography color="error">Failed to load plan details</Typography>
      </Box>
    );
  }

  // Handle API response structure - data might be wrapped in 'data' property
  const planData = planShow;

  if (!planData || Object.keys(planData).length === 0) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography color="error">No plan details found</Typography>
      </Box>
    );
  }

  const {
    finance_plan,
    payments = [],
    total_fee,
    paid_amount,
    due_amount,
    status,
  } = planData;

  // Check if finance_plan exists
  if (!finance_plan) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography color="error">Finance plan data not found</Typography>
      </Box>
    );
  }

  // Parse installment_schedule if it's a JSON string
  let installments = [];
  try {
    if (finance_plan?.installment_schedule) {
      const schedule =
        typeof finance_plan.installment_schedule === "string"
          ? JSON.parse(finance_plan.installment_schedule)
          : finance_plan.installment_schedule;
      installments = schedule?.installments || [];
    }
  } catch (error) {
    console.error("Error parsing installment_schedule:", error);
    installments = [];
  }

  // Calculate totals
  const subtotal = parseFloat(total_fee);
  const shipping = 0;
  const discount = 0;
  const taxes = 0;
  const totalAmount = subtotal - discount + shipping + (subtotal * taxes) / 100;

  const getStatusColor = (statusValue) => {
    switch (statusValue) {
      case "completed":
        return "success";
      case "partial":
        return "warning";
      case "pending":
        return "error";
      default:
        return "default";
    }
  };

  return (
    <Box sx={{ p: { xs: 2, sm: 3 } }}>
      <Card
        sx={{
          p: { xs: 2.5, sm: 3, md: 5 },
          borderRadius: 3,
          boxShadow: (theme) =>
            theme.palette.mode === "light"
              ? "0 12px 24px -4px rgba(145, 158, 171, 0.12)"
              : "0 12px 24px -4px rgba(0, 0, 0, 0.24)",
        }}
      >
        <Stack spacing={{ xs: 3, md: 4 }}>
          {/* Header Section */}
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", sm: "center" }}
            spacing={2}
          >
            <Box sx={{ flex: 1 }}>
              <Typography
                variant="h4"
                sx={{
                  mb: 1,
                  fontWeight: 700,
                  fontSize: { xs: "1.5rem", sm: "2rem" },
                }}
              >
                {finance_plan.plan_name}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ lineHeight: 1.6 }}
              >
                {finance_plan.description}
              </Typography>
            </Box>
            <Chip
              label={status.toUpperCase()}
              color={getStatusColor(status)}
              sx={{
                fontWeight: 600,
                height: 36,
                fontSize: "0.875rem",
                px: 2,
                boxShadow: 2,
              }}
            />
          </Stack>

          <Divider sx={{ borderStyle: "dashed" }} />

          {/* Invoice Details Grid - Enhanced Cards */}
          <Grid container spacing={{ xs: 2, sm: 2.5, md: 3 }}>
            {/* Plan From */}
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <Card
                variant="outlined"
                sx={{
                  p: 2.5,
                  height: "100%",
                  borderRadius: 2,
                  transition: "all 0.3s",
                  "&:hover": {
                    boxShadow: 4,
                    borderColor: "primary.main",
                    transform: "translateY(-4px)",
                  },
                }}
              >
                <Stack spacing={1.5}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Iconify
                      icon="solar:document-text-bold-duotone"
                      width={24}
                      sx={{ color: "primary.main" }}
                    />
                    <Typography
                      variant="overline"
                      sx={{ color: "text.secondary", fontWeight: 600 }}
                    >
                      Plan from
                    </Typography>
                  </Stack>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                    {finance_plan.visa_type} Visa Program
                  </Typography>
                  <Divider sx={{ my: 0.5 }} />
                  <Typography variant="caption" color="text.secondary">
                    Visa Type: {finance_plan.visa_type}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Currency: {finance_plan.currency}
                  </Typography>
                </Stack>
              </Card>
            </Grid>

            {/* Plan To */}
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <Card
                variant="outlined"
                sx={{
                  p: 2.5,
                  height: "100%",
                  borderRadius: 2,
                  transition: "all 0.3s",
                  "&:hover": {
                    boxShadow: 4,
                    borderColor: "info.main",
                    transform: "translateY(-4px)",
                  },
                }}
              >
                <Stack spacing={1.5}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Iconify
                      icon="solar:user-bold-duotone"
                      width={24}
                      sx={{ color: "info.main" }}
                    />
                    <Typography
                      variant="overline"
                      sx={{ color: "text.secondary", fontWeight: 600 }}
                    >
                      Plan to
                    </Typography>
                  </Stack>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                    Employee
                  </Typography>
                  <Divider sx={{ my: 0.5 }} />
                  <Typography variant="caption" color="text.secondary">
                    Employee ID: #{planShow?.employee_id}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Vacancy ID: #{planShow?.vacancy_id}
                  </Typography>
                </Stack>
              </Card>
            </Grid>

            {/* Installments */}
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <Card
                variant="outlined"
                sx={{
                  p: 2.5,
                  height: "100%",
                  borderRadius: 2,
                  transition: "all 0.3s",
                  "&:hover": {
                    boxShadow: 4,
                    borderColor: "warning.main",
                    transform: "translateY(-4px)",
                  },
                }}
              >
                <Stack spacing={1.5}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Iconify
                      icon="solar:bill-list-bold-duotone"
                      width={24}
                      sx={{ color: "warning.main" }}
                    />
                    <Typography
                      variant="overline"
                      sx={{ color: "text.secondary", fontWeight: 600 }}
                    >
                      Installments
                    </Typography>
                  </Stack>
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>
                    {finance_plan.installment_count}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Total installments
                  </Typography>
                </Stack>
              </Card>
            </Grid>

            {/* Paid Amount */}
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <Card
                variant="outlined"
                sx={{
                  p: 2.5,
                  height: "100%",
                  borderRadius: 2,
                  borderLeft: 4,
                  borderLeftColor: "success.main",
                  transition: "all 0.3s",
                  "&:hover": {
                    boxShadow: 4,
                    transform: "translateY(-4px)",
                  },
                }}
              >
                <Stack spacing={1.5}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Iconify
                      icon="solar:wallet-money-bold-duotone"
                      width={24}
                      sx={{ color: "success.main" }}
                    />
                    <Typography
                      variant="overline"
                      sx={{ color: "text.secondary", fontWeight: 600 }}
                    >
                      Paid Amount
                    </Typography>
                  </Stack>
                  <Typography
                    variant="h5"
                    sx={{ fontWeight: 700, color: "success.main" }}
                  >
                    {fCurrency(parseFloat(paid_amount))}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Total amount paid
                  </Typography>
                </Stack>
              </Card>
            </Grid>

            {/* Due Amount */}
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <Card
                variant="outlined"
                sx={{
                  p: 2.5,
                  height: "100%",
                  borderRadius: 2,
                  borderLeft: 4,
                  borderLeftColor:
                    parseFloat(due_amount) > 0 ? "error.main" : "success.main",
                  transition: "all 0.3s",
                  "&:hover": {
                    boxShadow: 4,
                    transform: "translateY(-4px)",
                  },
                }}
              >
                <Stack spacing={1.5}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Iconify
                      icon={
                        parseFloat(due_amount) > 0
                          ? "solar:danger-bold-duotone"
                          : "solar:check-circle-bold-duotone"
                      }
                      width={24}
                      sx={{
                        color:
                          parseFloat(due_amount) > 0
                            ? "error.main"
                            : "success.main",
                      }}
                    />
                    <Typography
                      variant="overline"
                      sx={{ color: "text.secondary", fontWeight: 600 }}
                    >
                      Due Amount
                    </Typography>
                  </Stack>
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 700,
                      color:
                        parseFloat(due_amount) > 0
                          ? "error.main"
                          : "success.main",
                    }}
                  >
                    {fCurrency(parseFloat(due_amount))}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {parseFloat(due_amount) > 0
                      ? "Remaining balance"
                      : "Fully paid"}
                  </Typography>
                </Stack>
              </Card>
            </Grid>
          </Grid>

          <Divider sx={{ borderStyle: "dashed" }} />

          {/* Installment Schedule Table */}
          <Box>
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              sx={{ mb: 3 }}
            >
              <Iconify
                icon="solar:bill-check-bold-duotone"
                width={28}
                sx={{ color: "primary.main" }}
              />
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Installment Schedule
              </Typography>
            </Stack>

            {/* Desktop Table View */}
            <Box sx={{ display: { xs: "none", md: "block" } }}>
              <TableContainer
                component={Paper}
                variant="outlined"
                sx={{
                  boxShadow: "none",
                  borderRadius: 2,
                  overflow: "hidden",
                }}
              >
                <Table>
                  <TableHead>
                    <TableRow
                      sx={{
                        bgcolor: "background.neutral",
                        "& th": {
                          fontWeight: 700,
                          fontSize: "0.875rem",
                        },
                      }}
                    >
                      <TableCell>#</TableCell>
                      <TableCell>Description</TableCell>
                      <TableCell align="center">Qty</TableCell>
                      <TableCell align="right">Unit price</TableCell>
                      <TableCell align="right">Total</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {installments.map((installment, index) => (
                      <TableRow
                        key={index}
                        sx={{
                          "&:hover": {
                            bgcolor: "primary.lighter",
                          },
                        }}
                      >
                        <TableCell>
                          <Chip
                            label={installment.installment_no}
                            size="small"
                            color="primary"
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                            Installment #{installment.installment_no}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {installment.description}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {installment.due_after_days} days
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2">
                            {fCurrency(installment.amount)}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography
                            variant="subtitle2"
                            sx={{ fontWeight: 700 }}
                          >
                            {fCurrency(installment.amount)}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>

            {/* Mobile Card View */}
            <Stack spacing={2} sx={{ display: { xs: "flex", md: "none" } }}>
              {installments.map((installment, index) => (
                <Card
                  key={index}
                  variant="outlined"
                  sx={{
                    p: 2.5,
                    borderRadius: 2,
                    borderLeft: 4,
                    borderLeftColor: "primary.main",
                  }}
                >
                  <Stack spacing={1.5}>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Chip
                        label={`#${installment.installment_no}`}
                        size="small"
                        color="primary"
                      />
                      <Typography variant="h6" sx={{ fontWeight: 700 }}>
                        {fCurrency(installment.amount)}
                      </Typography>
                    </Stack>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      Installment #{installment.installment_no}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {installment.description}
                    </Typography>
                    <Divider />
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Typography variant="caption" color="text.secondary">
                        Due After
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {installment.due_after_days} days
                      </Typography>
                    </Stack>
                  </Stack>
                </Card>
              ))}
            </Stack>

            {/* Totals Section */}
            <Stack spacing={2} alignItems="flex-end" sx={{ mt: 4 }}>
              <Stack
                spacing={1.5}
                sx={{
                  width: { xs: "100%", sm: 400 },
                  p: 3,
                  borderRadius: 2,
                  bgcolor: "background.neutral",
                }}
              >
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2" color="text.secondary">
                    Subtotal
                  </Typography>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    {fCurrency(subtotal)}
                  </Typography>
                </Stack>

                {shipping !== 0 && (
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">
                      Shipping
                    </Typography>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        fontWeight: 600,
                        color: shipping < 0 ? "error.main" : "text.primary",
                      }}
                    >
                      {shipping < 0 ? "-" : ""}
                      {fCurrency(Math.abs(shipping))}
                    </Typography>
                  </Stack>
                )}

                {discount !== 0 && (
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">
                      Discount
                    </Typography>
                    <Typography
                      variant="subtitle2"
                      sx={{ fontWeight: 600, color: "error.main" }}
                    >
                      -{fCurrency(discount)}
                    </Typography>
                  </Stack>
                )}

                {taxes !== 0 && (
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">
                      Taxes
                    </Typography>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      {taxes}%
                    </Typography>
                  </Stack>
                )}

                <Divider sx={{ borderStyle: "dashed" }} />

                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    Total
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 700, color: "primary.main" }}
                  >
                    {fCurrency(totalAmount)}
                  </Typography>
                </Stack>
              </Stack>
            </Stack>
          </Box>

          {/* Payment History Section */}
          {payments && payments.length > 0 && (
            <>
              <Divider sx={{ borderStyle: "dashed" }} />
              <Box>
                <Stack
                  direction="row"
                  spacing={1}
                  alignItems="center"
                  sx={{ mb: 3 }}
                >
                  <Iconify
                    icon="solar:wallet-money-bold-duotone"
                    width={28}
                    sx={{ color: "success.main" }}
                  />
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    Payment History
                  </Typography>
                </Stack>

                {/* Desktop Table View */}
                <Box sx={{ display: { xs: "none", md: "block" } }}>
                  <TableContainer
                    component={Paper}
                    variant="outlined"
                    sx={{
                      boxShadow: "none",
                      borderRadius: 2,
                      overflow: "hidden",
                    }}
                  >
                    <Table>
                      <TableHead>
                        <TableRow
                          sx={{
                            bgcolor: "background.neutral",
                            "& th": {
                              fontWeight: 700,
                              fontSize: "0.875rem",
                            },
                          }}
                        >
                          <TableCell>Date</TableCell>
                          <TableCell>Method</TableCell>
                          <TableCell>Note</TableCell>
                          <TableCell align="right">Amount</TableCell>
                          <TableCell align="center">Status</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {payments.map((payment) => (
                          <TableRow
                            key={payment.id}
                            sx={{
                              "&:hover": {
                                bgcolor: "action.hover",
                              },
                            }}
                          >
                            <TableCell>
                              <Typography
                                variant="body2"
                                sx={{ fontWeight: 600 }}
                              >
                                {fDate(payment.date)}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Stack
                                direction="row"
                                spacing={1}
                                alignItems="center"
                              >
                                <Iconify
                                  icon={
                                    payment.method === "Cash"
                                      ? "solar:wallet-money-bold-duotone"
                                      : "solar:card-bold-duotone"
                                  }
                                  width={24}
                                  sx={{ color: "primary.main" }}
                                />
                                <Typography variant="body2">
                                  {payment.method}
                                </Typography>
                              </Stack>
                            </TableCell>
                            <TableCell>
                              {/* <Typography
                                variant="body2"
                                color="text.secondary"
                                dangerouslySetInnerHTML={{ __html: payment.note }}
                              /> */}
                              <Markdown children={payment.note} />
                            </TableCell>
                            <TableCell align="right">
                              <Typography
                                variant="subtitle2"
                                sx={{ fontWeight: 700, color: "success.main" }}
                              >
                                {fCurrency(parseFloat(payment.amount))}
                              </Typography>
                            </TableCell>
                            <TableCell align="center">
                              <Chip
                                label={payment.status}
                                size="small"
                                color={getStatusColor(payment.status)}
                                sx={{
                                  textTransform: "capitalize",
                                  fontWeight: 600,
                                }}
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>

                {/* Mobile Card View */}
                <Stack spacing={2} sx={{ display: { xs: "flex", md: "none" } }}>
                  {payments.map((payment) => (
                    <Card
                      key={payment.id}
                      variant="outlined"
                      sx={{
                        p: 2.5,
                        borderRadius: 2,
                        borderLeft: 4,
                        borderLeftColor: "success.main",
                      }}
                    >
                      <Stack spacing={1.5}>
                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          alignItems="center"
                        >
                          <Chip
                            label={payment.status}
                            size="small"
                            color={getStatusColor(payment.status)}
                            sx={{ textTransform: "capitalize" }}
                          />
                          <Typography
                            variant="h6"
                            sx={{ fontWeight: 700, color: "success.main" }}
                          >
                            {fCurrency(parseFloat(payment.amount))}
                          </Typography>
                        </Stack>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Iconify
                            icon={
                              payment.method === "Cash"
                                ? "solar:wallet-money-bold-duotone"
                                : "solar:card-bold-duotone"
                            }
                            width={24}
                            sx={{ color: "primary.main" }}
                          />
                          <Typography
                            variant="subtitle2"
                            sx={{ fontWeight: 600 }}
                          >
                            {payment.method}
                          </Typography>
                        </Stack>
                        {/* <Typography
                          variant="body2"
                          color="text.secondary"
                          dangerouslySetInnerHTML={{ __html: payment.note }}
                        /> */}

                        <Markdown children={payment.note} />
                        <Divider />
                        <Typography variant="caption" color="text.secondary">
                          {fDate(payment.date)}
                        </Typography>
                      </Stack>
                    </Card>
                  ))}
                </Stack>

                {/* Payment Summary */}
                <Stack spacing={1.5} alignItems="flex-end" sx={{ mt: 3 }}>
                  <Stack
                    spacing={1.5}
                    sx={{
                      width: { xs: "100%", sm: 400 },
                      p: 3,
                      borderRadius: 2,
                      bgcolor: "background.neutral",
                    }}
                  >
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="body2" color="text.secondary">
                        Total Paid
                      </Typography>
                      <Typography
                        variant="subtitle2"
                        sx={{ fontWeight: 700, color: "success.main" }}
                      >
                        {fCurrency(parseFloat(paid_amount))}
                      </Typography>
                    </Stack>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="body2" color="text.secondary">
                        Due Amount
                      </Typography>
                      <Typography
                        variant="subtitle2"
                        sx={{
                          fontWeight: 700,
                          color:
                            parseFloat(due_amount) > 0
                              ? "error.main"
                              : "success.main",
                        }}
                      >
                        {fCurrency(parseFloat(due_amount))}
                      </Typography>
                    </Stack>
                  </Stack>
                </Stack>
              </Box>
            </>
          )}
        </Stack>
      </Card>
    </Box>
  );
}
