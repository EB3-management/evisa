import {
  Typography,
  Box,
  Card,
  CardContent,
  Chip,
  Button,
  Divider,
  Stack,
  Avatar,
  Paper,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useState } from "react";
import { DashboardContent } from "src/layouts/dashboard";
import { useGetContractDetail , signContract } from "src/api/document";
import { Iconify } from "src/components/iconify";
import { fDateTime } from "src/utils/format-time";
import { CustomBreadcrumbs } from "src/components/custom-breadcrumbs";
import { paths } from "src/routes/paths";
import Grid from "@mui/material/Grid2";
import { Markdown } from "src/components/markdown";
import { ContractSigningDialog } from "../dialog/contract-signing-dialog";
import { toast } from "sonner";

export function ContractDetailView({ id }) {
  const { contractDetail, contractDetailLoading, contractDetailError, refetch } =
    useGetContractDetail(id);
  const [openSigning, setOpenSigning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (contractDetailLoading) {
    return (
      <DashboardContent>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: 400,
          }}
        >
          <CircularProgress />
        </Box>
      </DashboardContent>
    );
  }
  

  if (contractDetailError) {
    return (
      <DashboardContent>
        <Alert severity="error">
          Failed to load contract details. Please try again.
        </Alert>
      </DashboardContent>
    );
  }

  const getStatusChipColor = (status) => {
    switch (status) {
      case "signed":
        return { bgcolor: "#D2F3EE", color: "#2BA597" };
      case "rejected":
        return { bgcolor: "#FFE7E7", color: "#D32F2F" };
      case "pending_signature":
      default:
        return { bgcolor: "#FFF4E5", color: "#F57C00" };
    }
  };

  const handleViewPdf = (url) => {
    window.open(url, "_blank");
  };

  const handleSubmitSignature = async (contractId, signatureData) => {
    setIsSubmitting(true);
    try {
      const response = await signContract(contractId, {
        signature: signatureData,
      });
      toast.success(response.message || "Contract signed successfully!");

      // Refresh the contract details
      if (refetch) {
        refetch();
      }

      setOpenSigning(false);
    } catch (error) {
      console.error("Sign contract error:", error);
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to sign contract";
      toast.error(errorMessage);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardContent maxWidth="xl">
      <CustomBreadcrumbs
        heading="Contract Details"
        links={[
          { name: "Dashboard", href: paths.dashboard.root },
          { name: "Contracts", href: paths.dashboard.contract.root },
          { name: contractDetail?.contract_number || "Details" },
        ]}
        sx={{ mb: 3 }}
      />

      {/* Header Section */}
      <Card sx={{ mb: 3, overflow: "visible" }}>
        <CardContent>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", sm: "center" }}
            spacing={2}
          >
            <Box>
              <Typography variant="h4" gutterBottom>
                {contractDetail?.contract_number}
              </Typography>
              <Stack direction="row" spacing={1} alignItems="center">
                <Chip
                  label={contractDetail?.status?.replace("_", " ")}
                  size="medium"
                  sx={{
                    textTransform: "capitalize",
                    fontWeight: 600,
                    ...getStatusChipColor(contractDetail?.status),
                  }}
                />
                {contractDetail?.signed_at && (
                  <Typography variant="caption" color="text.secondary">
                    Signed on {fDateTime(contractDetail.signed_at)}
                  </Typography>
                )}
              </Stack>
            </Box>

            <Stack direction="row" spacing={1}>
              {contractDetail?.unsigned_pdf_url && (
                <Button
                  variant="outlined"
                  startIcon={<Iconify icon="eva:file-text-outline" />}
                  onClick={() => handleViewPdf(contractDetail.unsigned_pdf_url)}
                >
                  Unsigned PDF
                </Button>
              )}
              {contractDetail?.signed_pdf_url && (
                <Button
                  variant="contained"
                  color="success"
                  startIcon={<Iconify icon="eva:checkmark-circle-2-fill" />}
                  onClick={() => handleViewPdf(contractDetail.signed_pdf_url)}
                >
                  Signed PDF
                </Button>
              )}
              {contractDetail?.status !== "signed" && (
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<Iconify icon="eva:edit-outline" />}
                  onClick={() => setOpenSigning(true)}
                >
                  Sign Contract
                </Button>
              )}
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      <Grid container spacing={3}>
        {/* Employee Information */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2} mb={3}>
                <Iconify
                  icon="mdi:account-circle"
                  width={32}
                  sx={{ color: "primary.main" }}
                />
                <Typography variant="h6">Employee Information</Typography>
              </Stack>

              <Stack spacing={2}>
                <InfoRow
                  label="Name"
                  value={`${contractDetail?.employee?.first_name} ${contractDetail?.employee?.last_name}`}
                />
                <InfoRow
                  label="Email"
                  value={contractDetail?.employee?.email}
                />
                <InfoRow
                  label="Phone"
                  value={`+${contractDetail?.employee?.country_code?.phonecode} ${contractDetail?.employee?.phone}`}
                />
                <InfoRow
                  label="Date of Birth"
                  value={contractDetail?.employee?.dob}
                />
                <InfoRow
                  label="Gender"
                  value={contractDetail?.employee?.gender}
                />
                <InfoRow
                  label="Nationality"
                  value={contractDetail?.employee?.nationality}
                />
                <InfoRow
                  label="Birth Country"
                  value={contractDetail?.employee?.birth_country?.nicename}
                />
                <InfoRow
                  label="Citizenship"
                  value={
                    contractDetail?.employee?.country_of_citizenship?.nicename
                  }
                />
                <InfoRow
                  label="Status"
                  value={
                    <Chip
                      label={contractDetail?.employee?.status?.replace(
                        "_",
                        " ",
                      )}
                      size="small"
                      color="primary"
                      variant="outlined"
                      sx={{ textTransform: "capitalize" }}
                    />
                  }
                />
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Vacancy Information */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2} mb={3}>
                <Iconify
                  icon="mdi:briefcase"
                  width={32}
                  sx={{ color: "primary.main" }}
                />
                <Typography variant="h6">Job Information</Typography>
              </Stack>

              <Stack spacing={2}>
                <InfoRow
                  label="Job Title"
                  value={contractDetail?.vacancy?.title}
                />
                <InfoRow
                  label="Company"
                  value={contractDetail?.vacancy?.employer?.company_name}
                />
                <InfoRow
                  label="Location"
                  value={contractDetail?.vacancy?.location}
                />
                <InfoRow
                  label="Wages"
                  value={
                    contractDetail?.vacancy?.wages
                      ? `$${contractDetail.vacancy.wages}/hr`
                      : "-"
                  }
                />
                <InfoRow
                  label="Visa Category"
                  value={contractDetail?.vacancy?.visa_category?.name}
                />
                <InfoRow
                  label="Status"
                  value={
                    <Chip
                      label={contractDetail?.vacancy?.status}
                      size="small"
                      color="success"
                      variant="outlined"
                    />
                  }
                />
                <InfoRow
                  label="Est. LC Filing Date"
                  value={contractDetail?.vacancy?.estimated_lc_filling_date}
                />
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Employer Details */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2} mb={3}>
                <Iconify
                  icon="mdi:office-building"
                  width={32}
                  sx={{ color: "primary.main" }}
                />
                <Typography variant="h6">Employer Details</Typography>
              </Stack>

              <Grid container spacing={3}>
                <Grid item xs={12} md={3}>
                  {contractDetail?.vacancy?.employer?.logo && (
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        mb: 2,
                      }}
                    >
                      <Avatar
                        src={contractDetail.vacancy.employer.logo}
                        variant="rounded"
                        sx={{ width: 120, height: 120 }}
                      />
                    </Box>
                  )}
                </Grid>
                <Grid item xs={12} md={9}>
                  <Stack spacing={3}>
                    {/* Company Name */}
                    <Box>
                      <Typography
                        variant="h5"
                        fontWeight={700}
                        color="text.primary"
                        gutterBottom
                      >
                        {contractDetail?.vacancy?.employer?.company_name}
                      </Typography>
                    </Box>

                    <Divider />

                    {/* Contact & General Info */}
                    <Grid container spacing={3}>
                      <Grid item xs={12} sm={6}>
                        <Paper
                          elevation={0}
                          sx={{
                            p: 2,
                            bgcolor: "background.neutral",
                            borderRadius: 2,
                            height: "100%",
                          }}
                        >
                          <Stack spacing={1.5}>
                            <Stack
                              direction="row"
                              spacing={1}
                              alignItems="center"
                            >
                              <Iconify
                                icon="mdi:email"
                                width={20}
                                sx={{ color: "primary.main" }}
                              />
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                Email
                              </Typography>
                            </Stack>
                            <Typography variant="body2" fontWeight={500}>
                              {contractDetail?.vacancy?.employer?.email || "-"}
                            </Typography>
                          </Stack>
                        </Paper>
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <Paper
                          elevation={0}
                          sx={{
                            p: 2,
                            bgcolor: "background.neutral",
                            borderRadius: 2,
                            height: "100%",
                          }}
                        >
                          <Stack spacing={1.5}>
                            <Stack
                              direction="row"
                              spacing={1}
                              alignItems="center"
                            >
                              <Iconify
                                icon="mdi:web"
                                width={20}
                                sx={{ color: "primary.main" }}
                              />
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                Website
                              </Typography>
                            </Stack>
                            <Typography
                              variant="body2"
                              fontWeight={500}
                              sx={{
                                wordBreak: "break-word",
                                color: "primary.main",
                                cursor: "pointer",
                                "&:hover": { textDecoration: "underline" },
                              }}
                              onClick={() =>
                                contractDetail?.vacancy?.employer?.website &&
                                window.open(
                                  contractDetail.vacancy.employer.website.startsWith(
                                    "http",
                                  )
                                    ? contractDetail.vacancy.employer.website
                                    : `https://${contractDetail.vacancy.employer.website}`,
                                  "_blank",
                                )
                              }
                            >
                              {contractDetail?.vacancy?.employer?.website ||
                                "-"}
                            </Typography>
                          </Stack>
                        </Paper>
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <Paper
                          elevation={0}
                          sx={{
                            p: 2,
                            bgcolor: "background.neutral",
                            borderRadius: 2,
                            height: "100%",
                          }}
                        >
                          <Stack spacing={1.5}>
                            <Stack
                              direction="row"
                              spacing={1}
                              alignItems="center"
                            >
                              <Iconify
                                icon="mdi:account-group"
                                width={20}
                                sx={{ color: "primary.main" }}
                              />
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                Number of Employees
                              </Typography>
                            </Stack>
                            <Typography variant="body2" fontWeight={500}>
                              {contractDetail?.vacancy?.employer
                                ?.number_of_employees || "-"}
                            </Typography>
                          </Stack>
                        </Paper>
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <Paper
                          elevation={0}
                          sx={{
                            p: 2,
                            bgcolor: "background.neutral",
                            borderRadius: 2,
                            height: "100%",
                          }}
                        >
                          <Stack spacing={1.5}>
                            <Stack
                              direction="row"
                              spacing={1}
                              alignItems="center"
                            >
                              <Iconify
                                icon="mdi:map-marker"
                                width={20}
                                sx={{ color: "primary.main" }}
                              />
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                Location
                              </Typography>
                            </Stack>
                            <Typography variant="body2" fontWeight={500}>
                              {contractDetail?.vacancy?.employer?.city &&
                              contractDetail?.vacancy?.employer?.state &&
                              contractDetail?.vacancy?.employer?.country
                                ? `${contractDetail.vacancy.employer.city}, ${contractDetail.vacancy.employer.state}, ${contractDetail.vacancy.employer.country}`
                                : "-"}
                            </Typography>
                          </Stack>
                        </Paper>
                      </Grid>
                    </Grid>

                    {/* Description */}
                    {contractDetail?.vacancy?.employer?.description && (
                      <>
                        <Divider />
                        <Box>
                          <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                            mb={2}
                          >
                            <Iconify
                              icon="mdi:information"
                              width={20}
                              sx={{ color: "primary.main" }}
                            />
                            <Typography
                              variant="subtitle2"
                              color="text.secondary"
                            >
                              About the Company
                            </Typography>
                          </Stack>
                          <Paper
                            elevation={0}
                            sx={{
                              p: 2.5,
                              bgcolor: "background.neutral",
                              borderRadius: 2,
                            }}
                          >
                            <Markdown>
                              {contractDetail.vacancy.employer.description}
                            </Markdown>
                          </Paper>
                        </Box>
                      </>
                    )}
                  </Stack>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Job Duties */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2} mb={2}>
                <Iconify
                  icon="mdi:clipboard-list"
                  width={32}
                  sx={{ color: "primary.main" }}
                />
                <Typography variant="h6">Job Duties</Typography>
              </Stack>
              {/* <Typography
                variant="body2"
                color="text.secondary"
                sx={{ whiteSpace: "pre-line" }}
              >
                {contractDetail?.vacancy?.job_duties ||
                  "No job duties specified"}
              </Typography> */}
              <Markdown
                children={
                  contractDetail?.vacancy?.job_duties ||
                  "No job duties specified"
                }
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Benefits */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2} mb={2}>
                <Iconify
                  icon="mdi:gift"
                  width={32}
                  sx={{ color: "primary.main" }}
                />
                <Typography variant="h6">Benefits</Typography>
              </Stack>
              {/* <Typography
                variant="body2"
                color="text.secondary"
                sx={{ whiteSpace: "pre-line" }}
              >
                {contractDetail?.vacancy?.benefits || "No benefits specified"}
              </Typography> */}
              <Markdown
                children={
                  contractDetail?.vacancy?.benefits || "No benefits specified"
                }
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Contract Timeline */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2} mb={3}>
                <Iconify
                  icon="mdi:timeline-clock"
                  width={32}
                  sx={{ color: "primary.main" }}
                />
                <Typography variant="h6">Contract Timeline</Typography>
              </Stack>

              <Grid container spacing={3}>
                <Grid item xs={12} sm={4}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      bgcolor: "background.neutral",
                      textAlign: "center",
                    }}
                  >
                    <Typography variant="caption" color="text.secondary">
                      Generated At
                    </Typography>
                    <Typography variant="body1" fontWeight={600}>
                      {contractDetail?.generated_at
                        ? fDateTime(contractDetail.generated_at)
                        : "-"}
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      bgcolor: "background.neutral",
                      textAlign: "center",
                    }}
                  >
                    <Typography variant="caption" color="text.secondary">
                      Signed At
                    </Typography>
                    <Typography variant="body1" fontWeight={600}>
                      {contractDetail?.signed_at
                        ? fDateTime(contractDetail.signed_at)
                        : "-"}
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      bgcolor: "background.neutral",
                      textAlign: "center",
                    }}
                  >
                    <Typography variant="caption" color="text.secondary">
                      Last Updated
                    </Typography>
                    <Typography variant="body1" fontWeight={600}>
                      {contractDetail?.updated_at
                        ? fDateTime(contractDetail.updated_at)
                        : "-"}
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Signature */}
        {contractDetail?.employee_signature && (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={2} mb={2}>
                  <Iconify
                    icon="mdi:signature-freehand"
                    width={32}
                    sx={{ color: "primary.main" }}
                  />
                  <Typography variant="h6">Employee Signature</Typography>
                </Stack>
                <Box
                  sx={{
                    p: 3,
                    bgcolor: "background.neutral",
                    borderRadius: 1,
                    display: "inline-block",
                  }}
                >
                  <img
                    src={`https://api.abroadworld.com/${contractDetail.employee_signature}`}
                    alt="Employee Signature"
                    style={{
                      maxWidth: "300px",
                      maxHeight: "150px",
                      objectFit: "contain",
                    }}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>

      <ContractSigningDialog
        open={openSigning}
        onClose={() => setOpenSigning(false)}
        contract={contractDetail}
        onSubmitSignature={handleSubmitSignature}
        isSubmitting={isSubmitting}
      />
    </DashboardContent>
  );
}

// Helper component for info rows
function InfoRow({ label, value }) {
  return (
    <Stack direction="row" spacing={2}>
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ minWidth: 120, fontWeight: 500 }}
      >
        {label}:
      </Typography>
      <Typography variant="body2" sx={{ wordBreak: "break-word" }}>
        {value || "-"}
      </Typography>
    </Stack>
  );
}
