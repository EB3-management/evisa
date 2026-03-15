import { useId, forwardRef } from "react";
import { mergeClasses } from "minimal-shared/utils";

import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import { styled, useTheme } from "@mui/material/styles";

import { RouterLink } from "src/routes/components";


import { logoClasses } from "./classes";

// ----------------------------------------------------------------------

export const Logo = forwardRef((props, ref) => {
  const {
    className,
    href = "/dashboard",
    isSingle = true,
    disabled,
    logoUrl,
    sx,
    size = "default",
    ...other
  } = props;

  const theme = useTheme();
  const gradientId = useId();

  const fallbackLogo = "/logo/logo-color.png";

  const faviconLogo = "/favicon.png";

  // const { siteSetting } = useAppSelector(selectSiteSetting);

  // const logoSource = logoUrl || fallbackLogo;
  const logoSource = size === "mini" ? faviconLogo : logoUrl || fallbackLogo;

  const logoHeight = {
    mini: 32, // Smaller for collapsed nav
    default: 40, // Regular size
    large: 48, // Larger if needed
  };

  const logoImg = (
    <img
      alt="Site logo"
      src={logoSource}
      width="100%"
      height="100%"
      style={{ objectFit: "contain" }}
    />
  );

  return (
    <LogoRoot
      ref={ref}
      component={RouterLink}
      href={href}
      aria-label="Logo"
      underline="none"
      className={mergeClasses([logoClasses.root, className])}
      sx={[
        () => ({
          display: "flex",
          alignItems: "center",
          gap: 1,
          ...(disabled && { pointerEvents: "none" }),
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      <Box
        sx={{
          height: logoHeight[size] || logoHeight.default, // ← Dynamic height
          width: size === "mini" ? logoHeight[size] : "auto", // ← Square for mini
          flexShrink: 0,
        }}
      >
        {logoImg}
      </Box>

      {/* {siteSetting?.site_name && (
        <Typography
          variant="h7"
          sx={{
            color: "white",
            fontWeight: 600,
          }}
        >
          {siteSetting.site_name}
        </Typography>
      )} */}
    </LogoRoot>
  );
});

// ----------------------------------------------------------------------

const LogoRoot = styled(Link)(() => ({
  flexShrink: 0,
  display: "inline-flex",
  alignItems: "center",
  verticalAlign: "middle",
  textDecoration: "none",
  justifyContent: "center",
}));
