import { useBoolean } from "minimal-shared/hooks";

import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";

import { Logo } from "src/components/logo";

import { paths } from "src/routes/paths";
import { usePathname } from "src/routes/hooks";

import { Footer } from "./footer";
import { NavMobile } from "./nav/mobile";
import { NavDesktop } from "./nav/desktop";
import { MainSection } from "../core/main-section";
import { MenuButton } from "../components/menu-button";
import { LayoutSection } from "../core/layout-section";
import { HeaderSection } from "../core/header-section";
import { navData as mainNavData } from "../nav-config-main";
import { SignInButton } from "../components/sign-in-button";


// ----------------------------------------------------------------------

export function MainLayout({
  sx,
  cssVars,
  children,
  slotProps,
  layoutQuery = "md",
}) {
  const pathname = usePathname();

  // const dispatch = useAppDispatch();

  const isOnBoardingFormPage = pathname.endsWith(paths.onBoardingForm.formPath);

  const { value: open, onFalse: onClose, onTrue: onOpen } = useBoolean();

  const navData = slotProps?.nav?.data ?? mainNavData;

  // useEffect(() => {
  //   dispatch(fetchSiteSettingRequest());
  // }, [dispatch]);

  const renderHeader = () => {
    if (isOnBoardingFormPage) return null;

    const headerSlots = {
      topArea: (
        <Alert severity="info" sx={{ display: "none", borderRadius: 0 }}>
          This is an info Alert.
        </Alert>
      ),
      leftArea: (
        <>
          {/** @slot Nav mobile */}
          <MenuButton
            onClick={onOpen}
            sx={(theme) => ({
              mr: 1,
              ml: -1,
              [theme.breakpoints.up(layoutQuery)]: { display: "none" },
            })}
          />
          <NavMobile data={navData} open={open} onClose={onClose} />

          {/** @slot Logo */}
          <Logo />
        </>
      ),
      rightArea: (
        <>
          {/** @slot Nav desktop */}
          <NavDesktop
            data={navData}
            sx={(theme) => ({
              display: "none",
              [theme.breakpoints.up(layoutQuery)]: { mr: 2.5, display: "flex" },
            })}
          />

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: { xs: 1, sm: 1.5 },
            }}
          >
            {/** @slot Sign in button */}
            <SignInButton />
          </Box>
        </>
      ),
    };

    return (
      <HeaderSection
        layoutQuery={layoutQuery}
        {...slotProps?.header}
        slots={{ ...headerSlots, ...slotProps?.header?.slots }}
        slotProps={slotProps?.header?.slotProps}
        sx={slotProps?.header?.sx}
      />
    );
  };

  const renderFooter = () => {
    if (isOnBoardingFormPage) return null;

    return <Footer sx={slotProps?.footer?.sx} layoutQuery={layoutQuery} />;
  };

  const renderMain = () => (
    <MainSection {...slotProps?.main}>{children}</MainSection>
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
      cssVars={cssVars}
      sx={sx}
    >
      {renderMain()}
    </LayoutSection>
  );
}
