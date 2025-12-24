import { useAppSelector } from "src/redux/hooks";
import { selectSiteSetting } from "src/redux/selectors";
import { HeaderSection, LayoutSection, MainSection } from "../core";
import { AuthCenteredContent } from "./content";
import { Alert, Box } from "@mui/material";
import { merge } from "es-toolkit";
import { SettingsButton } from "../components/settings-button";
import { RouterLink } from "src/routes/components";
import { paths } from "src/routes/paths";
import { Link } from "react-router";
import { Logo } from "src/components/logo";
import { FormCenteredContent } from "./form-content";

export function FormCenteredLayout({
  sx,
  cssVars,
  children,
  slotProps,
  layoutQuery = "md",
}) {
  const { siteSetting } = useAppSelector(selectSiteSetting) || {};

  // const renderHeader = () => {
  //   const headerSlotProps = { container: { maxWidth: false } };

  //   const headerSlots = {
  //     topArea: (
  //       <Alert severity="info" sx={{ display: "none", borderRadius: 0 }}>
  //         This is an info Alert.
  //       </Alert>
  //     ),
  //     leftArea: (
  //       <>
  //         {/* Logo */}
  //         <Logo logoUrl={siteSetting?.color_logo} />
  //       </>
  //     ),
  //     rightArea: (
  //       <Box
  //         sx={{
  //           display: "flex",
  //           alignItems: "center",
  //           gap: { xs: 1, sm: 1.5 },
  //         }}
  //       >
  //         {/* Help link */}
  //         <Link
  //           href={paths.faqs}
  //           component={RouterLink}
  //           color="#1d4aa5"
  //           sx={{ typography: "subtitle2" }}
  //         >
  //           Need help?
  //         </Link>

  //         {/* Settings button */}
  //         <SettingsButton />
  //       </Box>
  //     ),
  //   };

  //   return (
  //     <HeaderSection
  //       disableElevation
  //       layoutQuery={layoutQuery}
  //       {...slotProps?.header}
  //       slots={{ ...headerSlots, ...slotProps?.header?.slots }}
  //       slotProps={merge(headerSlotProps, slotProps?.header?.slotProps ?? {})}
  //       sx={[
  //         {
  //           position: { [layoutQuery]: "fixed" },
  //           bgcolor: "rgba(255, 255, 255, 0.95)",
  //           backdropFilter: "blur(10px)",
  //           boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
  //         },
  //         ...(Array.isArray(slotProps?.header?.sx)
  //           ? slotProps?.header?.sx ?? []
  //           : [slotProps?.header?.sx]),
  //       ]}
  //     />
  //   );
  // };

  const renderFooter = () => null;

  const renderMain = () => (
    <MainSection
      {...slotProps?.main}
      sx={[
        (theme) => ({
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          background: "rgba(33, 37, 41, 1)",
          p: { xs: 3, md: 5 },
        }),
        ...(Array.isArray(slotProps?.main?.sx)
          ? slotProps?.main?.sx ?? []
          : [slotProps?.main?.sx]),
      ]}
    >
      {/* Centered eligibility form */}
      <Box
        sx={{
          width: "100%",
          maxWidth: { xs: "100%", sm: 720, md: 900, lg: 1000 },
          display: "flex",
          alignItems: "center",
          justifyContent: "center",

          p: { xs: 3, md: 5 },
        }}
      >
        <FormCenteredContent {...slotProps?.content}>
          {children}
        </FormCenteredContent>
      </Box>
    </MainSection>
  );

  return (
    <LayoutSection
      /** **************************************
       * @Header
       *************************************** */
      // headerSection={renderHeader()}
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
