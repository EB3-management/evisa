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

export function PlanDetail({ id }) {
  const [planData, setPlanData] = useState(null);

  // Mock data - replace with actual API call
  useEffect(() => {
    // Simulating API response
    const mockData = {
      id: 17,
      employee_id: 1,
      finance_plan_id: 2,
      total_fee: "9000.00",
      paid_amount: "9000.00",
      due_amount: "0.00",
      created_at: "2025-11-02T11:14:07.000000Z",
      status: "completed",
      vacancy_id: 2,
      finance_plan: {
        id: 2,
        visa_type: "EB-3",
        plan_name: "Updated EB-3 Standard Plan",
        description:
          "Updated version — includes additional document support and flexible payment terms.",
        total_fee: "9000.00",
        installment_count: 3,
        installment_schedule: {
          installments: [
            {
              installment_no: 1,
              amount: 3000.0,
              due_after_days: 0,
              description: "Initial payment at process start",
            },
            {
              installment_no: 2,
              amount: 3000.0,
              due_after_days: 60,
              description: "Second installment after 2 months",
            },
            {
              installment_no: 3,
              amount: 3000.0,
              due_after_days: 120,
              description: "Final installment before visa submission",
            },
          ],
        },
        currency: "USD",
        status: "active",
        created_by: 1,
        created_at: "2025-10-17T06:03:21.000000Z",
      },
      payments: [
        {
          id: 3,
          employee_id: 1,
          amount: "4500.00",
          method: "Cash",
          date: "2025-11-02",
          note: "First Installment",
          created_at: "2025-11-02T11:13:15.000000Z",
          status: "partial",
        },
        {
          id: 4,
          employee_id: 1,
          amount: "4500.00",
          method: "Bank",
          date: "2025-11-02",
          note: "Second Installment",
          created_at: "2025-11-02T11:14:06.000000Z",
          status: "partial",
        },
      ],
    };
    setPlanData(mockData);
  }, [id]);

  if (!planData) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  const { finance_plan, payments, total_fee, paid_amount, due_amount, status } =
    planData;
  const installments = finance_plan.installment_schedule?.installments || [];

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
          p: { xs: 2, sm: 3, md: 5 },
          borderRadius: 3,
          boxShadow: (theme) =>
            `0 12px 24px -4px ${theme.palette.mode === "light" ? "rgba(145, 158, 171, 0.12)" : "rgba(0, 0, 0, 0.24)"}`,
        }}
      >
        <Stack spacing={{ xs: 3, md: 4 }}>
          {/* Header Section */}
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", sm: "center" }}
            spacing={2}
            sx={{
              p: { xs: 2, sm: 3 },
              borderRadius: 2,
              background: (theme) =>
                `linear-gradient(135deg, ${theme.palette.primary.lighter} 0%, ${theme.palette.primary.light}20 100%)`,
            }}
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

          {/* Invoice Details Grid */}
          <Grid container spacing={{ xs: 2, sm: 3 }}>
            {/* Plan From */}
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
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
                <Stack spacing={1}>
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
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    {finance_plan.visa_type} Visa Program
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Plan ID: #{finance_plan.id}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Currency: {finance_plan.currency}
                  </Typography>
                </Stack>
              </Card>
            </Grid>

            {/* Plan To */}
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
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
                <Stack spacing={1}>
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
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    Employee
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Employee ID: #{planData.employee_id}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Vacancy ID: #{planData.vacancy_id}
                  </Typography>
                </Stack>
              </Card>
            </Grid>

            {/* Date Created */}
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
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
                <Stack spacing={1}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Iconify
                      icon="solar:calendar-bold-duotone"
                      width={24}
                      sx={{ color: "success.main" }}
                    />
                    <Typography
                      variant="overline"
                      sx={{ color: "text.secondary", fontWeight: 600 }}
                    >
                      Date create
                    </Typography>
                  </Stack>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    {fDate(planData.created_at)}
                  </Typography>
                </Stack>
              </Card>
            </Grid>

            {/* Installments */}
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
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
                <Stack spacing={1}>
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
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    {finance_plan.installment_count} installments
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
              sx={{ mb: 2 }}
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
                            bgcolor: "action.hover",
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
                          <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
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
                    p: 2,
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
                    <Typography variant="subtitle2">
                      Installment #{installment.installment_no}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {installment.description}
                    </Typography>
                    <Divider sx={{ my: 0.5 }} />
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

                <Stack
                  direction="row"
                  justifyContent="space-between"
                  sx={{
                    p: 2,
                    borderRadius: 1.5,
                    bgcolor: "primary.lighter",
                  }}
                >
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
                              <Typography variant="body2" sx={{ fontWeight: 600 }}>
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
                              <Typography variant="body2" color="text.secondary">
                                {payment.note}
                              </Typography>
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
                                sx={{ textTransform: "capitalize", fontWeight: 600 }}
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
                        p: 2,
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
                          <Typography variant="subtitle2">
                            {payment.method}
                          </Typography>
                        </Stack>
                        <Typography variant="body2" color="text.secondary">
                          {payment.note}
                        </Typography>
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
