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
import Button from "@mui/material/Button";

import { RouterLink } from "src/routes/components";

import { fDate } from "src/utils/format-time";
import { fCurrency } from "src/utils/format-number";

import { Iconify } from "src/components/iconify";
import { CustomPopover } from "src/components/custom-popover";
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
  const menuActions = usePopover();
  const router = useRouter();

  const handleClick = () => {
    router.push(paths.dashboard.vacancy.detail(job.id));
  };

  return (
    <>
      <Card sx={sx} {...other}>
        <Box sx={{ p: 3, pb: 2 }}>
          <Avatar
            alt={job.employer_name}
            // src={job.company_logo || "https://via.placeholder.com/48"}
            src={job.employer_name}
            variant="rounded"
            sx={{ width: 48, height: 48, mb: 2, bgcolor: "secondary.main" }}
          />

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
              <Typography variant="caption" noWrap>
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
