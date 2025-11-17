import {
  Box,
  Container,
  Typography,
  Paper,
  Stack,
  Chip,
  Skeleton,
} from "@mui/material";
import { useGetGuide } from "src/api/faqs";
import { Markdown } from "src/components/markdown";
import { Iconify } from "src/components/iconify";

// ----------------------------------------------------------------------

export function GuideView() {
  const { guide, guideLoading, guideError } = useGetGuide();

  // Loading state
  if (guideLoading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          py: { xs: 3, sm: 4, md: 6 },
          px: { xs: 2, sm: 3 },
        }}
      >
        <Container maxWidth="lg">
          <Skeleton variant="text" width="60%" height={60} sx={{ mb: 3 }} />
          <Paper
            sx={{
              p: { xs: 2, sm: 3, md: 4, lg: 5 },
              borderRadius: { xs: 1, sm: 2 },
            }}
          >
            <Skeleton variant="rectangular" height={400} />
          </Paper>
        </Container>
      </Box>
    );
  }

  // Error state
  if (guideError) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          py: { xs: 3, sm: 4, md: 6 },
          px: { xs: 2, sm: 3 },
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Container maxWidth="sm">
          <Paper
            sx={{
              p: 4,
              textAlign: "center",
              borderRadius: 2,
              bgcolor: "error.lighter",
            }}
          >
            <Iconify
              icon="solar:danger-triangle-bold"
              width={64}
              sx={{ color: "error.main", mb: 2 }}
            />
            <Typography variant="h6" color="error.main" gutterBottom>
              Failed to Load Guide
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Please try again later or contact support.
            </Typography>
          </Paper>
        </Container>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        py: { xs: 3, sm: 4, md: 6 },
        px: { xs: 2, sm: 3 },
        bgcolor: "background.default",
      }}
    >
      <Container maxWidth="lg">
        {/* Header Section */}
        <Stack
          direction="row"
          alignItems="center"
          spacing={2}
          sx={{
            mb: { xs: 2, sm: 2.5, md: 3 },
            px: { xs: 0, sm: 1 },
          }}
        >
          <Iconify
            icon="solar:document-text-bold-duotone"
            width={{ xs: 32, sm: 40, md: 48 }}
            sx={{
              color: "secondary.main",
              display: { xs: "none", sm: "block" },
            }}
          />
          <Typography
            variant="h3"
            component="h1"
            sx={{
              color: "secondary.main",
              fontSize: { xs: "1.75rem", sm: "2rem", md: "2.5rem" },
              fontWeight: 600,
              textAlign: { xs: "center", sm: "left" },
              flex: 1,
            }}
          >
            {guide?.title || "EB-3 Visa Guide"}
          </Typography>
          <Chip
            icon={<Iconify icon="solar:book-bold" width={20} />}
            label="Guide"
            color="secondary"
            sx={{
              fontWeight: 600,
              display: { xs: "none", md: "flex" },
            }}
          />
        </Stack>

        {/* Content Section */}
        <Paper
          elevation={3}
          sx={{
            p: { xs: 2, sm: 3, md: 4, lg: 5 },
            borderRadius: { xs: 1, sm: 2 },
            bgcolor: "background.paper",
            boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
          }}
        >
          <Box
            sx={{
              "& .markdown": {
                "& > *": {
                  marginBottom: 2,
                },
                // Headings
                "& h1, & h2, & h3, & h4, & h5, & h6": {
                  color: "text.primary",
                  fontWeight: 600,
                  marginTop: { xs: 2, sm: 3 },
                  marginBottom: { xs: 1.5, sm: 2 },
                  lineHeight: 1.3,
                },
                "& h1": {
                  fontSize: { xs: "1.75rem", sm: "2rem", md: "2.25rem" },
                },
                "& h2": {
                  fontSize: { xs: "1.5rem", sm: "1.75rem", md: "2rem" },
                  color: "secondary.main",
                },
                "& h3": {
                  fontSize: { xs: "1.25rem", sm: "1.5rem", md: "1.75rem" },
                },
                "& h4": {
                  fontSize: { xs: "1.1rem", sm: "1.25rem", md: "1.5rem" },
                },
                // Paragraphs
                "& p": {
                  color: "text.secondary",
                  lineHeight: 1.8,
                  fontSize: { xs: "0.875rem", sm: "1rem" },
                  marginBottom: 2,
                },
                // Lists
                "& ul, & ol": {
                  paddingLeft: { xs: 2.5, sm: 3, md: 4 },
                  marginBottom: 2,
                  "& li": {
                    marginBottom: 1.5,
                    color: "text.secondary",
                    fontSize: { xs: "0.875rem", sm: "1rem" },
                    lineHeight: 1.7,
                    "& p": {
                      marginBottom: 0.5,
                    },
                  },
                },
                // Strong/Bold
                "& strong": {
                  color: "text.primary",
                  fontWeight: 700,
                },
                // Links
                "& a": {
                  color: "secondary.main",
                  textDecoration: "none",
                  fontWeight: 500,
                  "&:hover": {
                    textDecoration: "underline",
                  },
                },
                // Tables
                "& table": {
                  width: "100%",
                  borderCollapse: "collapse",
                  marginTop: 2,
                  marginBottom: 3,
                  overflowX: "auto",
                  display: { xs: "block", md: "table" },
                  "& thead": {
                    bgcolor: "secondary.main",
                    "& th": {
                      color: "#fff",
                      fontWeight: 700,
                      padding: { xs: 1, sm: 1.5, md: 2 },
                      textAlign: "left",
                      fontSize: { xs: "0.75rem", sm: "0.875rem", md: "1rem" },
                      borderBottom: "2px solid",
                      borderColor: "secondary.dark",
                    },
                  },
                  "& tbody": {
                    "& tr": {
                      borderBottom: "1px solid",
                      borderColor: "divider",
                      "&:nth-of-type(even)": {
                        bgcolor: "action.hover",
                      },
                      "&:hover": {
                        bgcolor: "action.selected",
                      },
                    },
                    "& td": {
                      padding: { xs: 1, sm: 1.5, md: 2 },
                      color: "text.secondary",
                      fontSize: { xs: "0.75rem", sm: "0.875rem", md: "1rem" },
                      borderBottom: "1px solid",
                      borderColor: "divider",
                    },
                  },
                },
                // Blockquotes
                "& blockquote": {
                  borderLeft: "4px solid",
                  borderColor: "secondary.main",
                  paddingLeft: 2,
                  marginLeft: 0,
                  marginRight: 0,
                  marginY: 2,
                  color: "text.secondary",
                  fontStyle: "italic",
                  bgcolor: "action.hover",
                  py: 1.5,
                  px: 2,
                  borderRadius: 1,
                },
                // Code blocks
                "& code": {
                  bgcolor: "action.hover",
                  color: "secondary.main",
                  padding: "2px 6px",
                  borderRadius: 0.5,
                  fontSize: "0.875em",
                  fontFamily: "monospace",
                },
                "& pre": {
                  bgcolor: "action.hover",
                  padding: 2,
                  borderRadius: 1,
                  overflowX: "auto",
                  "& code": {
                    bgcolor: "transparent",
                    padding: 0,
                  },
                },
              },
            }}
          >
            <Markdown children={guide?.description || ""} />
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
