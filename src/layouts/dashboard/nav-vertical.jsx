import { varAlpha, mergeClasses } from "minimal-shared/utils";

import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";

import { Logo } from "src/components/logo";
import { Scrollbar } from "src/components/scrollbar";
import { NavSectionVertical } from "src/components/nav-section";

import { layoutClasses } from "../core/classes";

// ----------------------------------------------------------------------

export function NavVertical({
  sx,
  data,
  slots,
  cssVars,
  className,
  layoutQuery = "md",
  ...other
}) {
  return (
    <NavRoot
      layoutQuery={layoutQuery}
      className={mergeClasses([
        layoutClasses.nav.root,
        layoutClasses.nav.vertical,
        className,
      ])}
      sx={sx}
      {...other}
    >
      {slots?.topArea ?? (
        <Box sx={{ pl: 3.5, pt: 2.5, pb: 1 }}>
          <Logo size="default" />
        </Box>
      )}

      <Scrollbar fillContent>
        <NavSectionVertical
          data={data}
          cssVars={cssVars}
          sx={{ px: 2, flex: "1 1 auto" }}
        />
      </Scrollbar>

      {slots?.bottomArea}
    </NavRoot>
  );
}

// ----------------------------------------------------------------------

const NavRoot = styled("div", {
  shouldForwardProp: (prop) => !["layoutQuery", "sx"].includes(prop),
})(({ layoutQuery = "md", theme }) => ({
  top: 0,
  left: 0,
  height: "100%",
  display: "none",
  position: "fixed",
  flexDirection: "column",
  zIndex: "var(--layout-nav-zIndex)",
  backgroundColor: "var(--layout-nav-bg)",
  width: "var(--layout-nav-vertical-width)",
  borderRight: `1px solid var(--layout-nav-border-color, ${varAlpha(
    theme.vars.palette.grey["500Channel"],
    0.12,
  )})`,
  [theme.breakpoints.up(layoutQuery)]: { display: "flex" },
}));
