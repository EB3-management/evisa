
import {
  Box,
  Paper,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Icon } from "@iconify/react";

// ----------------------------------------------------------------------
const steps = [
  {
    label: "1. Signup by Institute",
    icon: "mdi:account",
  },
  {
    label: "2. Create Campaign & Form",
    icon: "mdi:assignment-turned-in",
  },
  {
    label: "3. Generate & Share QR",
    icon: "mdi:qrcode-scan",
  },
  {
    label: "4. Lead Scans & Fills Form",
    icon: "mdi:qrcode-edit",
  },
  {
    label: "5. Lead Captured & Rewarded",
    icon: "mdi:gift-open-outline",
  },
];

function FlowCard({ icon, label }) {
  return (
    <Paper
      elevation={3}
      sx={{
        background:
          "linear-gradient(180deg, #5383ff 0%, rgba(53, 73, 255, 0.7) 100%)",
        color: "#fff",
        padding: 1,
        borderRadius: 3,
        width: { xs: 80, sm: 90, md: 100 },
        height: { xs: 70, sm: 80, md: 90 },
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      <Box mb={1}>
        <Icon icon={icon} width="14" height="14" />
      </Box>
      <Typography
        fontSize={{ xs: 9, sm: 10 }}
        sx={{
          wordBreak: "break-word",
          whiteSpace: "normal",
          lineHeight: 1.2,
        }}
      >
        {label}
      </Typography>
    </Paper>
  );
}
export function AppWelcome({ title, description, img, sx, ...other }) {
  const theme1 = useTheme();
  const isMdUp = useMediaQuery(theme1.breakpoints.up("md"));
  return (
    <Box
      sx={[
        (theme) => ({
          ...theme.mixins.bgGradient({
            images: [
              `linear-gradient(180deg, rgb(23 36 69) 10%, rgba(22, 22, 25, 0.7) 500%)`,
              `url(/assets/background/background-5.webp)`,
            ],
          }),
          pt: { xs: 3, md: 5 },
          pb: { xs: 3, md: 5 },
          pr: { xs: 2, md: 3 },
          pl: { xs: 2, md: 5 },
          gap: { xs: 3, md: 5 },
          borderRadius: 2,
          display: "flex",
          height: { md: 1 },
          position: "relative",
          alignItems: "center",
          color: "common.white",
          textAlign: { xs: "center", md: "left" },
          flexDirection: { xs: "column", md: "row" },
          border: `solid 1px ${theme.vars.palette.grey[800]}`,
          overflowX: "hidden",
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      <Box
        sx={{
          display: "flex",
          flex: "1 1 auto",
          flexDirection: "column",
          alignItems: { xs: "center", md: "flex-start" },
        }}
      >
        <Typography variant="h4" sx={{ whiteSpace: "pre-line", mb: 1 }}>
          {title}
        </Typography>

        <Typography
          variant="body2"
          sx={{ opacity: 0.64, maxWidth: { xs: "100%", md: 360 } }}
        >
          {description}
        </Typography>

        <Stack
          direction="row"
          spacing={2}
          mt={2}
          flexWrap="wrap"
          justifyContent={isMdUp ? "flex-start" : "center"}
          gap={1}
        >
          {steps.map((step, idx) => (
            <FlowCard key={idx} icon={step.icon} label={step.label} />
          ))}
        </Stack>
      </Box>

      {img && (
        <Box
          sx={{
            maxWidth: { xs: 200, md: 250 },
            mt: { xs: 3, md: 0 },
            flexShrink: 0,
            display: "flex",
            justifyContent: "center",
          }}
        >
          {img}
        </Box>
      )}
    </Box>
  );
}
