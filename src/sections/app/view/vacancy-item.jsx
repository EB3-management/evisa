import { useMemo, useState } from "react";

import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Card from "@mui/material/Card";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import ListItemText from "@mui/material/ListItemText";
import Button from "@mui/material/Button";

import { RouterLink } from "src/routes/components";

import { fDate } from "src/utils/format-time";

import { Iconify } from "src/components/iconify";
import { paths } from "src/routes/paths";
import { useRouter } from "src/routes/hooks";

// ----------------------------------------------------------------------

export function VacancyItem({
  job,
  editHref,
  detailsHref,
  onDelete,
  sx,
  ...other
}) {
  const router = useRouter();
  const [logoError, setLogoError] = useState(false);

  const employerName =
    job?.employer_name || job?.employer?.company_name || "Employer";
  const employerLogo = job?.employer?.logo || null;

  const employerInitials = useMemo(() => {
    const parts = employerName
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() || "");

    return parts.join("") || "E";
  }, [employerName]);

  const avatarSrc = !logoError && employerLogo ? employerLogo : undefined;

  const handleClick = () => {
    router.push(paths.dashboard.vacancy.detail(job.id));
  };

  return (
    <>
      <Card sx={sx} {...other}>
        <Box sx={{ p: 3, pb: 2 }}>
          <Box
            sx={{
              width: 72,
              height: 72,
              mb: 2,
              p: 0.75,
              borderRadius: 2.5,
              border: "1px solid",
              borderColor: "divider",
              bgcolor: "action.hover",
              boxShadow: (theme) => theme.customShadows?.z8,
            }}
          >
            <Avatar
              alt={employerName}
              src={avatarSrc}
              variant="rounded"
              imgProps={{
                loading: "lazy",
                referrerPolicy: "no-referrer",
                onError: () => setLogoError(true),
              }}
              sx={{
                width: "100%",
                height: "100%",
                borderRadius: 2,
                // bgcolor: avatarSrc ? "common.white" : "secondary.main",
                // color: "secondary.contrastText",
                fontWeight: 700,
                fontSize: 24,
                letterSpacing: 0.5,
                ".MuiAvatar-img": {
                  objectFit: "contain",
                  p: 0.5,
                },
              }}
            >
              {!avatarSrc ? employerInitials : null}
            </Avatar>
          </Box>

          <ListItemText
            sx={{ mb: 1 }}
            primary={
              <Link component={RouterLink} href={detailsHref} color="inherit">
                {job.title}
              </Link>
            }
            secondary={`Posted date: ${fDate(job.created_at)}`}
            slotProps={{
              primary: { sx: { typography: "subtitle1" } },
              secondary: {
                sx: { mt: 1, typography: "caption", color: "text.disabled" },
              },
            }}
          />

          <Box
            sx={{
              gap: 0.5,
              display: "flex",
              alignItems: "center",
              color: "success.main",
              typography: "caption",
            }}
          >
            <Iconify width={16} icon="solar:check-circle-bold" />
            Status: {job.status}
          </Box>
        </Box>

        <Divider sx={{ borderStyle: "dashed" }} />

        <Box
          sx={{
            p: 3,
            rowGap: 1.5,
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
          }}
        >
          {[
            {
              label: job.employer_name,
              icon: (
                <Iconify
                  width={16}
                  icon="solar:buildings-2-bold"
                  sx={{ flexShrink: 0 }}
                />
              ),
            },
            {
              label: job.location,
              icon: (
                <Iconify
                  width={16}
                  icon="mingcute:location-fill"
                  sx={{ flexShrink: 0 }}
                />
              ),
            },
            {
              label: `${job.wages} per hour`,
              icon: (
                <Iconify
                  width={16}
                  icon="solar:wad-of-money-bold"
                  sx={{ flexShrink: 0 }}
                />
              ),
            },
            {
              label: job.title,
              icon: (
                <Iconify
                  width={16}
                  icon="solar:case-bold"
                  sx={{ flexShrink: 0 }}
                />
              ),
            },
          ].map((item) => (
            <Box
              key={item.label}
              sx={{
                gap: 0.5,
                minWidth: 0,
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                color: "text.disabled",
              }}
            >
              {item.icon}
              <Typography
                variant="caption"
                noWrap
                sx={{
                  color: "text.primary",
                  fontWeight: 500,
                }}
              >
                {item.label}
              </Typography>
            </Box>
          ))}
        </Box>

        <Divider sx={{ borderStyle: "dashed" }} />

        <Box sx={{ p: 2 }}>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            endIcon={<Iconify icon="eva:arrow-ios-forward-fill" />}
            onClick={handleClick}
            sx={{
              textTransform: "none",
              fontWeight: 600,
            }}
          >
            View Detail
          </Button>
        </Box>
      </Card>
    </>
  );
}
