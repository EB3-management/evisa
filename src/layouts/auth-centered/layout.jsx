import { merge } from "es-toolkit";

import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Alert from "@mui/material/Alert";

import { paths } from "src/routes/paths";
import { RouterLink } from "src/routes/components";

import { Logo } from "src/components/logo";

import { useAppSelector } from "src/redux/hooks";
import { selectSiteSetting } from "src/redux/selectors";

import { AuthCenteredContent } from "./content";
import { MainSection } from "../core/main-section";
import { LayoutSection } from "../core/layout-section";
import { HeaderSection } from "../core/header-section";
import { SettingsButton } from "../components/settings-button";
import { AuthSplitSection } from "../auth-split/auth-split-section";

// ----------------------------------------------------------------------

export function AuthCenteredLayout({
  sx,
  cssVars,
  children,
  slotProps,
  layoutQuery = "md",
}) {
  const { siteSetting } = useAppSelector(selectSiteSetting) || {};

  const renderHeader = () => {
    const headerSlotProps = { container: { maxWidth: false } };

    const headerSlots = {
      topArea: (
        <Alert severity="info" sx={{ display: "none", borderRadius: 0 }}>
          This is an info Alert.
        </Alert>
      ),
      leftArea: (
        <>
          {/** @slot Logo */}
          <Logo logoUrl={siteSetting?.color_logo} />
        </>
      ),
      rightArea: (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: { xs: 1, sm: 1.5 },
          }}
        >
          {/** @slot Help link */}
          <Link
            href={paths.faqs}
            component={RouterLink}
            color="#1d4aa5"
            sx={{ typography: "subtitle2" }}
          >
            Need help?
          </Link>

          {/** @slot Settings button */}
          <SettingsButton />
        </Box>
      ),
    };

    return (
      <HeaderSection
        disableElevation
        layoutQuery={layoutQuery}
        {...slotProps?.header}
        slots={{ ...headerSlots, ...slotProps?.header?.slots }}
        slotProps={merge(headerSlotProps, slotProps?.header?.slotProps ?? {})}
        sx={[
          { position: { [layoutQuery]: "fixed" } },
          ...(Array.isArray(slotProps?.header?.sx)
            ? slotProps?.header?.sx ?? []
            : [slotProps?.header?.sx]),
        ]}
      />
    );
  };

  const renderFooter = () => null;

  const renderMain = () => (
    <MainSection
      {...slotProps?.main}
      sx={[
        (theme) => ({
          display: "flex",
          flexDirection: "column",
          [theme.breakpoints.up(layoutQuery)]: {
            flexDirection: "row", // Side-by-side layout on larger screens
          },
          minHeight: "100vh",
          alignItems: "stretch",
          justifyContent: "center",
          p: 0,
        }),
        ...(Array.isArray(slotProps?.main?.sx)
          ? slotProps?.main?.sx ?? []
          : [slotProps?.main?.sx]),
      ]}
    >
      {/* Left section (image + text) */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          // bgcolor: "background.default",
          background: "rgba(33, 37, 41, 1)",
          p: 5,
        }}
      >
        <AuthSplitSection
          layoutQuery={layoutQuery}
          method="jwt"
          {...slotProps?.section}
          methods={[]}
        />
      </Box>

      {/* Right section (form) */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: { xs: 3, md: 10 },
          background: "rgba(33, 37, 41, 1)",
        }}
      >
        <AuthCenteredContent {...slotProps?.content}>
          {children}
        </AuthCenteredContent>
      </Box>
    </MainSection>
  );

  return (
    <LayoutSection
      /** **************************************
       * @Header
       *************************************** */
      headerSection={renderHeader()}
      /** **************************************
       * @Footer
       *************************************** */
      footerSection={renderFooter()}
      /** **************************************
       * @Styles
       *************************************** */
      cssVars={{ "--layout-auth-content-width": "420px", ...cssVars }}
      sx={[
        {
          position: "relative",
          // background: "rgba(33, 37, 41, 1)",
          "&::before": backgroundStyles(),
          minHeight: "100vh",
          width: "100%",
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      {renderMain()}
    </LayoutSection>
  );
}

// ----------------------------------------------------------------------

const backgroundStyles = () => ({
  content: "''",
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  background:
    "linear-gradient(180deg, #0e8b7e 50%, rgba(248, 227, 190, 0.7) 100%)",
  filter: "blur(250px)",

  pointerEvents: "none",
});
