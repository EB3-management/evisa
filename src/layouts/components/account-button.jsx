import { m } from "framer-motion";

import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";

import {
  varTap,
  varHover,
  AnimateBorder,
  transitionTap,
} from "src/components/animate";

// ----------------------------------------------------------------------

export function AccountButton({
  photoURL,
  displayName,
  profile,
  sx,
  ...other
}) {
  // Get initials from first and last name
  const getInitials = () => {
    if (profile?.first_name && profile?.last_name) {
      return `${profile.first_name.charAt(0)}${profile.last_name.charAt(0)}`.toUpperCase();
    }
    return displayName?.charAt(0).toUpperCase();
  };

  return (
    <IconButton
      component={m.button}
      whileTap={varTap(0.96)}
      whileHover={varHover(1.04)}
      transition={transitionTap()}
      aria-label="Account button"
      sx={[{ p: 0 }, ...(Array.isArray(sx) ? sx : [sx])]}
      {...other}
    >
      <AnimateBorder
        sx={{ p: "3px", borderRadius: "50%", width: 40, height: 40 }}
        slotProps={{
          primaryBorder: {
            size: 60,
            width: "1px",
            sx: { color: "primary.main" },
          },
          secondaryBorder: { sx: { color: "warning.main" } },
        }}
      >
        <Avatar src={photoURL} alt={displayName} sx={{ width: 1, height: 1 }}>
          {getInitials()}
        </Avatar>
      </AnimateBorder>
    </IconButton>
  );
}
