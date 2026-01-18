import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Iconify } from "src/components/iconify";
import { ONBOARDING_STEPS } from "src/constant/onboardingSteps";

const drawerWidth = 260;

export const OnboardingSidebar = ({
  mobileOpen,
  onClose,
  onItemClick,
  currentStep,
  completedSteps = new Set(),
}) => {
  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // Check if a step is accessible
  const isStepAccessible = (stepIndex) => {
    // Current step is always accessible
    if (stepIndex === currentStep) return true;

    // Previous steps are always accessible
    if (stepIndex < currentStep) return true;

    // For forward navigation, all previous steps must be completed
    for (let i = 0; i < stepIndex; i++) {
      if (!completedSteps.has(i)) {
        return false;
      }
    }

    return true;
  };

  const drawerContent = (
    <Box
      sx={{
        height: "100%",
        backgroundColor: theme.palette.background.paper, // ✅ use theme bg
        color: theme.palette.text.primary,
        py: 3,
      }}
    >
      <List>
        {ONBOARDING_STEPS.map((step, index) => {
          const isAccessible = isStepAccessible(index);
          const isCurrentStep = index === currentStep;
          const isCompleted = completedSteps.has(index);

          return (
            <ListItemButton
              key={step.id}
              onClick={() => isAccessible && onItemClick(index)}
              disabled={!isAccessible}
              sx={{
                borderRadius: 1,
                mx: 1,
                mb: 0.5,
                backgroundColor: isCurrentStep
                  ? theme.palette.primary.lighter
                  : "transparent",
                "&:hover": {
                  backgroundColor: isAccessible
                    ? theme.palette.action.hover
                    : "transparent",
                },
                position: "relative",
                opacity: isAccessible ? 1 : 0.5,
                cursor: isAccessible ? "pointer" : "not-allowed",
                pr: 5, // Add padding-right to make room for the icon
              }}
            >
              <ListItemText
                primary={step.label}
                primaryTypographyProps={{
                  fontSize: 14,
                  color: isCurrentStep
                    ? theme.palette.primary.main
                    : theme.palette.text.primary,
                  fontWeight: isCurrentStep ? 600 : 400,
                  noWrap: false, // Allow text wrapping
                  sx: {
                    wordBreak: "break-word",
                    pr: 1, // Add padding to prevent overlap with icon
                  },
                }}
              />
              {isCompleted ? (
                <Iconify
                  icon="eva:checkmark-circle-2-fill"
                  width={20}
                  sx={{
                    color: theme.palette.success.main,
                    position: "absolute",
                    right: 8,
                  }}
                />
              ) : isCurrentStep ? (
                <Iconify
                  icon="eva:arrow-ios-forward-fill"
                  width={16}
                  sx={{
                    color: theme.palette.primary.main,
                    position: "absolute",
                    right: 8,
                  }}
                />
              ) : (
                <Iconify
                  icon="eva:radio-button-off-outline"
                  width={16}
                  sx={{
                    color: theme.palette.text.disabled,
                    position: "absolute",
                    right: 8,
                  }}
                />
              )}
            </ListItemButton>
          );
        })}
      </List>
    </Box>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <Box
        sx={{
          width: { xs: 0, md: drawerWidth },
          flexShrink: 0,
          display: { xs: "none", md: "block" },
          backgroundColor: theme.palette.background.paper,
        }}
      >
        {drawerContent}
      </Box>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            backgroundColor: theme.palette.primary.main, // ✅ main brand color for mobile
            color: theme.palette.primary.contrastText,
          },
        }}
      >
        {drawerContent}
      </Drawer>
    </>
  );
};
