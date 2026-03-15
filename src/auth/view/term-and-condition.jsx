import {
  Box,
  Container,
  Typography,
  Paper,
  Stack,
} from "@mui/material";
import { useRouter } from "src/routes/hooks";
import { useGettermCondition } from "src/api";
import { Markdown } from "src/components/markdown";

// ----------------------------------------------------------------------

export function TermsAndConditions() {
  const router = useRouter();

  const { termCondition } = useGettermCondition();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        py: { xs: 3, sm: 4, md: 6 },
        px: { xs: 2, sm: 3 },
      }}
    >
      <Container maxWidth="lg">
        {/* Header Section */}
        <Stack
          spacing={2}
          sx={{
            mb: { xs: 2, sm: 2.5, md: 3 },
            px: { xs: 0, sm: 1 },
          }}
        >
          <Typography
            variant="h3"
            component="h1"
            sx={{
              color: "secondary.main",
              fontSize: { xs: "1.75rem", sm: "2rem", md: "2.5rem" },
              fontWeight: 600,
              textAlign: { xs: "center", sm: "left" },
            }}
          >
            {termCondition.title || "Terms and Conditions"}
          </Typography>
        </Stack>

        {/* Content Section */}
        <Paper
          elevation={2}
          sx={{
            p: { xs: 2, sm: 3, md: 4, lg: 5 },
            borderRadius: { xs: 1, sm: 2 },
            bgcolor: "background.paper",
          }}
        >
          <Box>
            <Markdown children={termCondition.description || ""} />
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

//
