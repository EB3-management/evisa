import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  Stack,
  Divider,
  Chip,
} from "@mui/material";
import { useRouter } from "src/routes/hooks";
import { Iconify } from "src/components/iconify";

// ----------------------------------------------------------------------

export function TermsAndConditions() {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        
        py: { xs: 4, md: 6 },
      }}
    >
      <Container maxWidth="lg">
        {/* Header Section */}
        <Stack spacing={1.5} sx={{ mb: 4 }}>
          <Button
            startIcon={<Iconify icon="eva:arrow-back-fill" />}
            onClick={handleBack}
            variant="text"
            color="inherit"
            sx={{
              alignSelf: "flex-start",
              fontWeight: 600,
              "&:hover": {
                bgcolor: "action.hover",
              },
            }}
          >
            Back to Sign Up
          </Button>

          <Stack
            sx={{
              p: { xs: 3, md: 5 },
            }}
          >
            <Typography
              variant="h6"
              sx={{
                color: "secondary.main",
                fontSize: { xs: "1.75rem", md: "2.5rem" },
              }}
            >
              Terms and Conditions
            </Typography>
            <Typography variant="subtitle1" sx={{ color: "text.secondary" }}>
              Please read these terms and conditions carefully before using our
              EB-3 Visa Application Platform services.
            </Typography>
          </Stack>
        </Stack>

        {/* Content Section */}
        <Paper
          elevation={2}
          sx={{
            p: { xs: 3, md: 5 },
            borderRadius: 2,
            bgcolor: "background.paper",
          }}
        >
          <Stack
            spacing={4}
            divider={<Divider sx={{ borderStyle: "dashed" }} />}
          >
            {/* Introduction */}
            <Box>
              <Stack
                direction="row"
                spacing={2}
                alignItems="center"
                sx={{ mb: 2 }}
              >
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: 1.5,
                    bgcolor: "primary.lighter",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{ color: "primary.main", fontWeight: 700 }}
                  >
                    1
                  </Typography>
                </Box>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 700, color: "text.primary" }}
                >
                  Introduction
                </Typography>
              </Stack>
              <Typography
                variant="body1"
                sx={{ color: "text.secondary", lineHeight: 1.8, pl: 7 }}
              >
                Welcome to our EB-3 Visa Application Platform. By accessing and
                using our services, you agree to be bound by these Terms and
                Conditions. Please read them carefully before proceeding with
                your application.
              </Typography>
            </Box>

            {/* Services Provided */}
            <Box>
              <Stack
                direction="row"
                spacing={2}
                alignItems="center"
                sx={{ mb: 2 }}
              >
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: 1.5,
                    bgcolor: "primary.lighter",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{ color: "primary.main", fontWeight: 700 }}
                  >
                    2
                  </Typography>
                </Box>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 700, color: "text.primary" }}
                >
                  Services Provided
                </Typography>
              </Stack>
              <Box sx={{ pl: 7 }}>
                <Typography
                  variant="body1"
                  sx={{ color: "text.secondary", mb: 2, lineHeight: 1.8 }}
                >
                  Our platform provides assistance with:
                </Typography>
                <Box component="ul" sx={{ pl: 3, m: 0 }}>
                  <Typography
                    component="li"
                    variant="body1"
                    sx={{ color: "text.secondary", mb: 1, lineHeight: 1.8 }}
                  >
                    EB-3 visa eligibility assessment
                  </Typography>
                  <Typography
                    component="li"
                    variant="body1"
                    sx={{ color: "text.secondary", mb: 1, lineHeight: 1.8 }}
                  >
                    Job matching with approved U.S. employers
                  </Typography>
                  <Typography
                    component="li"
                    variant="body1"
                    sx={{ color: "text.secondary", mb: 1, lineHeight: 1.8 }}
                  >
                    Application documentation support
                  </Typography>
                  <Typography
                    component="li"
                    variant="body1"
                    sx={{ color: "text.secondary", lineHeight: 1.8 }}
                  >
                    Visa processing guidance
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* User Responsibilities */}
            <Box>
              <Stack
                direction="row"
                spacing={2}
                alignItems="center"
                sx={{ mb: 2 }}
              >
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: 1.5,
                    bgcolor: "primary.lighter",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{ color: "primary.main", fontWeight: 700 }}
                  >
                    3
                  </Typography>
                </Box>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 700, color: "text.primary" }}
                >
                  User Responsibilities
                </Typography>
              </Stack>
              <Box sx={{ pl: 7 }}>
                <Typography
                  variant="body1"
                  sx={{ color: "text.secondary", mb: 2, lineHeight: 1.8 }}
                >
                  As a user of our platform, you agree to:
                </Typography>
                <Box component="ul" sx={{ pl: 3, m: 0 }}>
                  <Typography
                    component="li"
                    variant="body1"
                    sx={{ color: "text.secondary", mb: 1, lineHeight: 1.8 }}
                  >
                    Provide accurate and truthful information
                  </Typography>
                  <Typography
                    component="li"
                    variant="body1"
                    sx={{ color: "text.secondary", mb: 1, lineHeight: 1.8 }}
                  >
                    Keep your account credentials secure
                  </Typography>
                  <Typography
                    component="li"
                    variant="body1"
                    sx={{ color: "text.secondary", mb: 1, lineHeight: 1.8 }}
                  >
                    Submit all required documents in a timely manner
                  </Typography>
                  <Typography
                    component="li"
                    variant="body1"
                    sx={{ color: "text.secondary", lineHeight: 1.8 }}
                  >
                    Comply with U.S. immigration laws and regulations
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* Payment Terms */}
            <Box>
              <Stack
                direction="row"
                spacing={2}
                alignItems="center"
                sx={{ mb: 2 }}
              >
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: 1.5,
                    bgcolor: "primary.lighter",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{ color: "primary.main", fontWeight: 700 }}
                  >
                    4
                  </Typography>
                </Box>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 700, color: "text.primary" }}
                >
                  Payment Terms
                </Typography>
              </Stack>
              <Typography
                variant="body1"
                sx={{ color: "text.secondary", lineHeight: 1.8, pl: 7 }}
              >
                All fees are clearly outlined in your selected payment plan.
                Payments are non-refundable once services have been initiated.
                We accept various payment methods including bank transfers and
                credit cards. Installment plans are available as per the agreed
                schedule.
              </Typography>
            </Box>

            {/* No Guarantee Clause */}
            <Box>
              <Stack
                direction="row"
                spacing={2}
                alignItems="center"
                sx={{ mb: 2 }}
              >
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: 1.5,
                    bgcolor: "primary.lighter",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{ color: "primary.main", fontWeight: 700 }}
                  >
                    5
                  </Typography>
                </Box>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 700, color: "text.primary" }}
                >
                  No Guarantee of Visa Approval
                </Typography>
              </Stack>
              <Typography
                variant="body1"
                sx={{ color: "text.secondary", lineHeight: 1.8, pl: 7 }}
              >
                We provide assistance and guidance throughout the EB-3 visa
                application process. However, we cannot guarantee visa approval
                as the final decision rests with U.S. immigration authorities
                (USCIS). Our services are designed to maximize your chances of
                success.
              </Typography>
            </Box>

            {/* Confidentiality */}
            <Box>
              <Stack
                direction="row"
                spacing={2}
                alignItems="center"
                sx={{ mb: 2 }}
              >
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: 1.5,
                    bgcolor: "primary.lighter",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{ color: "primary.main", fontWeight: 700 }}
                  >
                    6
                  </Typography>
                </Box>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 700, color: "text.primary" }}
                >
                  Confidentiality and Data Protection
                </Typography>
              </Stack>
              <Typography
                variant="body1"
                sx={{ color: "text.secondary", lineHeight: 1.8, pl: 7 }}
              >
                We are committed to protecting your personal information. All
                data collected is handled in accordance with applicable privacy
                laws. We do not share your information with third parties
                without your consent, except as required by law or necessary for
                visa processing.
              </Typography>
            </Box>

            {/* Termination */}
            <Box>
              <Stack
                direction="row"
                spacing={2}
                alignItems="center"
                sx={{ mb: 2 }}
              >
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: 1.5,
                    bgcolor: "primary.lighter",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{ color: "primary.main", fontWeight: 700 }}
                  >
                    7
                  </Typography>
                </Box>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 700, color: "text.primary" }}
                >
                  Termination
                </Typography>
              </Stack>
              <Typography
                variant="body1"
                sx={{ color: "text.secondary", lineHeight: 1.8, pl: 7 }}
              >
                We reserve the right to suspend or terminate your account if you
                violate these terms or provide false information. You may also
                request account termination by contacting our support team.
              </Typography>
            </Box>

            {/* Limitation of Liability */}
            <Box>
              <Stack
                direction="row"
                spacing={2}
                alignItems="center"
                sx={{ mb: 2 }}
              >
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: 1.5,
                    bgcolor: "primary.lighter",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{ color: "primary.main", fontWeight: 700 }}
                  >
                    8
                  </Typography>
                </Box>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 700, color: "text.primary" }}
                >
                  Limitation of Liability
                </Typography>
              </Stack>
              <Typography
                variant="body1"
                sx={{ color: "text.secondary", lineHeight: 1.8, pl: 7 }}
              >
                Our liability is limited to the fees paid for our services. We
                are not responsible for delays or denials by immigration
                authorities, employer decisions, or circumstances beyond our
                control.
              </Typography>
            </Box>

            {/* Changes to Terms */}
            <Box>
              <Stack
                direction="row"
                spacing={2}
                alignItems="center"
                sx={{ mb: 2 }}
              >
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: 1.5,
                    bgcolor: "primary.lighter",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{ color: "primary.main", fontWeight: 700 }}
                  >
                    9
                  </Typography>
                </Box>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 700, color: "text.primary" }}
                >
                  Changes to Terms
                </Typography>
              </Stack>
              <Typography
                variant="body1"
                sx={{ color: "text.secondary", lineHeight: 1.8, pl: 7 }}
              >
                We may update these Terms and Conditions periodically. Users
                will be notified of significant changes via email. Continued use
                of our services after changes constitutes acceptance of the
                updated terms.
              </Typography>
            </Box>

            {/* Governing Law */}
            <Box>
              <Stack
                direction="row"
                spacing={2}
                alignItems="center"
                sx={{ mb: 2 }}
              >
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: 1.5,
                    bgcolor: "primary.lighter",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{ color: "primary.main", fontWeight: 700 }}
                  >
                    10
                  </Typography>
                </Box>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 700, color: "text.primary" }}
                >
                  Governing Law
                </Typography>
              </Stack>
              <Typography
                variant="body1"
                sx={{ color: "text.secondary", lineHeight: 1.8, pl: 7 }}
              >
                These Terms and Conditions are governed by the laws of the
                United States. Any disputes will be resolved through arbitration
                or in the courts of the jurisdiction where our company is
                registered.
              </Typography>
            </Box>

            {/* Contact Information */}
            <Box>
              <Stack
                direction="row"
                spacing={2}
                alignItems="center"
                sx={{ mb: 2 }}
              >
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: 1.5,
                    bgcolor: "primary.lighter",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{ color: "primary.main", fontWeight: 700 }}
                  >
                    11
                  </Typography>
                </Box>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 700, color: "text.primary" }}
                >
                  Contact Us
                </Typography>
              </Stack>
              <Box sx={{ pl: 7 }}>
                <Typography
                  variant="body1"
                  sx={{ color: "text.secondary", mb: 2, lineHeight: 1.8 }}
                >
                  If you have questions about these Terms and Conditions, please
                  contact us at:
                </Typography>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    bgcolor: "background.neutral",
                    borderRadius: 1.5,
                  }}
                >
                  <Stack spacing={1.5}>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <Iconify
                        icon="eva:email-fill"
                        width={20}
                        sx={{ color: "primary.main" }}
                      />
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        Email: support@eb3visa.com
                      </Typography>
                    </Stack>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <Iconify
                        icon="eva:phone-fill"
                        width={20}
                        sx={{ color: "primary.main" }}
                      />
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        Phone: +1 (555) 123-4567
                      </Typography>
                    </Stack>
                  </Stack>
                </Paper>
              </Box>
            </Box>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
}

//
