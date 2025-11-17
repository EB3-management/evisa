import { useState } from "react";
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Container,
  Stack,
  useTheme,
  useMediaQuery,
  Card,
} from "@mui/material";
import { Iconify } from "src/components/iconify";
import Grid from "@mui/material/Grid2";
import { useGetFaqs } from "src/api";
import { Markdown } from "src/components/markdown";

// FAQ Data
const FAQ_DATA = [
  {
    id: 1,
    question: "What is the EB-3 Visa?",
    answer:
      "The EB-3 visa is an employment-based immigrant visa category for skilled workers, professionals, and other workers seeking permanent residence in the United States. It allows employers to sponsor foreign nationals for green cards based on their qualifications and job requirements.",
  },
  {
    id: 2,
    question: "Who is eligible for an EB-3 Visa?",
    answer:
      "Eligibility for an EB-3 visa includes skilled workers with at least 2 years of training or experience, professionals with a U.S. bachelor's degree or foreign equivalent, and other workers capable of performing unskilled labor. You must have a valid job offer from a U.S. employer who will sponsor your application.",
  },
  {
    id: 3,
    question: "How long does the EB-3 visa process take?",
    answer:
      "The EB-3 visa processing time varies depending on your country of origin and the visa bulletin. Generally, it can take anywhere from 2 to 5 years or longer. Processing times include PERM labor certification (6-12 months), I-140 petition (4-6 months), and consular processing or adjustment of status (6-18 months).",
  },
  {
    id: 4,
    question: "What documents are required for EB-3 visa application?",
    answer:
      "Required documents include: valid passport, educational certificates and transcripts, work experience letters, job offer letter from U.S. employer, PERM labor certification approval, Form I-140 approval notice, medical examination results, police clearance certificates, birth certificate, marriage certificate (if applicable), and financial documents.",
  },
  {
    id: 5,
    question: "What are the costs associated with EB-3 visa?",
    answer:
      "Total costs typically range from $5,000 to $15,000 and include: PERM labor certification filing ($1,000-$3,000), I-140 petition filing ($700-$2,500), visa application fees ($325-$345 per person), medical examination ($200-$500), document translations and authentication ($500-$1,500), attorney fees (varies), and travel expenses.",
  },
  {
    id: 6,
    question: "Can I pay in installments?",
    answer:
      "Yes! We offer flexible payment plans with multiple installment options. You can choose from various finance plans based on your budget. Payment schedules can be customized to match your financial situation, with options for monthly, quarterly, or milestone-based payments.",
  },
  {
    id: 7,
    question: "What is PERM Labor Certification?",
    answer:
      "PERM (Program Electronic Review Management) is the labor certification process required before filing an EB-3 petition. Your employer must prove that there are no qualified U.S. workers available for the position. This involves advertising the job, conducting recruitment, and documenting the results.",
  },
  {
    id: 8,
    question: "Can my family accompany me on an EB-3 visa?",
    answer:
      "Yes, your spouse and unmarried children under 21 can accompany you to the United States. They will receive derivative visas (E-34 for spouses and E-35 for children). Your spouse may also apply for work authorization (Form I-765) after entering the U.S.",
  },
  {
    id: 9,
    question: "Can I change jobs after getting an EB-3 visa?",
    answer:
      "If your I-485 (adjustment of status) has been pending for 180 days or more, you can change jobs using AC21 portability. The new job must be in the same or similar occupational classification. However, changing jobs before this period may require starting the green card process over with the new employer.",
  },
  {
    id: 10,
    question: "What happens after I get my EB-3 green card?",
    answer:
      "After receiving your EB-3 green card, you become a lawful permanent resident with the right to live and work anywhere in the United States. You can travel freely, sponsor certain family members, and after 5 years (or 3 if married to a U.S. citizen), you may apply for U.S. citizenship through naturalization.",
  },
];

export function FaqsView() {
  const { faqs, faqsLoading, faqsError } = useGetFaqs();
  const [expanded, setExpanded] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        // background: "linear-gradient(135deg, #F0F9F8 0%, #E8F5F3 100%)",
        py: { xs: 4, sm: 6, md: 8 },
      }}
    >
      <Container maxWidth="lg">
        {/* Header Section */}
        <Stack
          spacing={{ xs: 2, sm: 3 }}
          alignItems="center"
          sx={{ mb: { xs: 4, sm: 6 } }}
        >
          <Box
            sx={{
              width: { xs: 48, sm: 56 },
              height: { xs: 48, sm: 56 },
              borderRadius: "50%",
              bgcolor: "secondary.main",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 8px 24px rgba(43, 165, 151, 0.24)",
            }}
          >
            <Iconify
              icon="solar:question-circle-bold"
              width={{ xs: 24, sm: 28 }}
              sx={{ color: "white" }}
            />
          </Box>

          <Stack spacing={1} alignItems="center">
            <Typography
              variant={isMobile ? "h5" : "h4"}
              sx={{
                fontWeight: 700,
                textAlign: "center",
              }}
            >
              Frequently Asked Questions
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: "text.secondary",
                textAlign: "center",
                maxWidth: 600,
                fontSize: { xs: "0.875rem", sm: "0.9375rem" },
              }}
            >
              Find answers to common questions about EB-3 visa process,
              requirements, and more
            </Typography>
          </Stack>
        </Stack>

        {/* FAQ Accordions */}
        <Stack spacing={2}>
          {faqs.map((faq, index) => (
            <Accordion
              key={faq.id}
              expanded={expanded === `panel${faq.id}`}
              onChange={handleChange(`panel${faq.id}`)}
              sx={{
                bgcolor: "white",
                borderRadius: "12px !important",
                border: 2,
                borderColor:
                  expanded === `panel${faq.id}`
                    ? "primary.main"
                    : index % 2 === 0
                    ? "primary.lighter"
                    : "secondary.lighter",
                boxShadow:
                  expanded === `panel${faq.id}`
                    ? "0 8px 24px rgba(43, 165, 151, 0.16)"
                    : "0 2px 8px rgba(0, 0, 0, 0.04)",
                transition: "all 0.3s ease",
                "&:before": {
                  display: "none",
                },
                "&:hover": {
                  boxShadow: "0 4px 16px rgba(43, 165, 151, 0.12)",
                },
              }}
            >
              <AccordionSummary
                expandIcon={
                  <Box
                    sx={{
                      width: { xs: 28, sm: 32 },
                      height: { xs: 28, sm: 32 },
                      borderRadius: "50%",
                      bgcolor:
                        expanded === `panel${faq.id}`
                          ? "primary.main"
                          : "primary.lighter",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "all 0.3s ease",
                    }}
                  >
                    <Iconify
                      icon={
                        expanded === `panel${faq.id}`
                          ? "eva:minus-outline"
                          : "eva:plus-outline"
                      }
                      width={{ xs: 16, sm: 18 }}
                      sx={{
                        color:
                          expanded === `panel${faq.id}`
                            ? "white"
                            : "primary.main",
                      }}
                    />
                  </Box>
                }
                sx={{
                  px: { xs: 2, sm: 3 },
                  py: { xs: 1.5, sm: 2 },
                  "& .MuiAccordionSummary-content": {
                    my: { xs: 1, sm: 1.5 },
                  },
                }}
              >
                <Stack spacing={1} sx={{ width: "100%", pr: 2 }}>
                  <Typography
                    variant="body1"
                    sx={{
                      fontWeight: 600,
                      color: "text.primary",
                      lineHeight: 1.5,
                      fontSize: { xs: "0.9375rem", sm: "1rem" },
                    }}
                  >
                    {faq.question}
                  </Typography>
                </Stack>
              </AccordionSummary>
              <AccordionDetails
                sx={{
                  px: { xs: 2, sm: 3 },
                  pb: { xs: 2, sm: 3 },
                  pt: 0,
                }}
              >
                {/* <Typography
                  variant="body2"
                  sx={{
                    color: "text.secondary",
                    lineHeight: 1.7,
                    fontSize: { xs: "0.875rem", sm: "0.9375rem" },
                  }}
                >
                  {faq.answer}
                </Typography> */}
                <Markdown children={faq.answer} />
              </AccordionDetails>
            </Accordion>
          ))}
        </Stack>

        {/* Contact Section */}
        <Card
          sx={{
            mt: { xs: 4, sm: 6 },
            background: "linear-gradient(135deg, #F0F9F8 0%, #E8F5F3 100%)",
            borderRadius: { xs: 2, sm: 3 },
            border: 2,
            borderColor: "primary.lighter",
            overflow: "hidden",
            position: "relative",
          }}
        >
          <Box sx={{ p: { xs: 3, sm: 4, md: 5 } }}>
            <Grid container spacing={{ xs: 3, md: 4 }}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Stack spacing={2}>
                  <Typography
                    variant={isMobile ? "h6" : "h5"}
                    sx={{
                      fontWeight: 700,
                      color: "text.primary",
                      letterSpacing: "-0.5px",
                    }}
                  >
                    Still Have Questions?
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "text.secondary",
                      lineHeight: 1.7,
                      fontSize: { xs: "0.875rem", sm: "0.9375rem" },
                    }}
                  >
                    Can&apos;t find what you&apos;re looking for? Our dedicated
                    support team is available 24/7 to assist you with your EB-3
                    visa application process.
                  </Typography>
                </Stack>
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <Stack spacing={2}>
                  <Card
                    sx={{
                      p: { xs: 2, sm: 2.5 },
                      bgcolor: "white",
                      border: 2,
                      borderColor: "secondary.lighter",
                      borderRadius: 2,
                      transition: "all 0.3s ease",
                      "&:hover": {
                        borderColor: "primary.main",
                        transform: "translateX(4px)",
                      },
                    }}
                  >
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: 2,
                          bgcolor: "primary.lighter",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Iconify
                          icon="solar:phone-bold-duotone"
                          width={20}
                          sx={{ color: "primary.main" }}
                        />
                      </Box>
                      <Box>
                        <Typography
                          variant="caption"
                          sx={{
                            color: "text.secondary",
                            fontWeight: 500,
                            fontSize: "0.75rem",
                          }}
                        >
                          Call Us
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: "text.primary",
                            fontWeight: 600,
                            fontSize: "0.9375rem",
                          }}
                        >
                          +1 (972) 999-0180 / +1 (703) 867-5233
                        </Typography>
                      </Box>
                    </Stack>
                  </Card>

                  <Card
                    sx={{
                      p: { xs: 2, sm: 2.5 },
                      bgcolor: "white",
                      border: 2,
                      borderColor: "primary.lighter",
                      borderRadius: 2,
                      transition: "all 0.3s ease",
                      "&:hover": {
                        borderColor: "primary.main",
                        transform: "translateX(4px)",
                      },
                    }}
                  >
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: 2,
                          bgcolor: "secondary.lighter",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Iconify
                          icon="solar:letter-bold-duotone"
                          width={20}
                          sx={{ color: "primary.main" }}
                        />
                      </Box>
                      <Box>
                        <Typography
                          variant="caption"
                          sx={{
                            color: "text.secondary",
                            fontWeight: 500,
                            fontSize: "0.75rem",
                          }}
                        >
                          Email Us
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: "text.primary",
                            fontWeight: 600,
                            fontSize: "0.9375rem",
                          }}
                        >
                          support@eb3visa.com
                        </Typography>
                      </Box>
                    </Stack>
                  </Card>
                </Stack>
              </Grid>
            </Grid>
          </Box>
        </Card>
      </Container>
    </Box>
  );
}
