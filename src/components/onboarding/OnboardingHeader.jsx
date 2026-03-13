import { AppBar, Box, Divider, IconButton, Toolbar } from "@mui/material";
import { Iconify } from "src/components/iconify";
import { Logo } from "src/components/logo";

export const  OnboardingHeader = ({ onMenuClick, onClose }) => (
  <>
    <AppBar
      position="static"
      sx={{
        backgroundColor: "transparent",
        boxShadow: "none",
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <IconButton
            color="inherit"
            edge="start"
            onClick={onMenuClick}
            sx={{ display: { md: "none" } }}
          >
            <Iconify icon="eva:menu-fill" width={24} />
          </IconButton>
          <Logo sx={{ height: 36 }} />
        </Box>
        <IconButton color="inherit" onClick={onClose}>
          <Iconify icon="eva:close-fill" width={24} />
        </IconButton>
      </Toolbar>
    </AppBar>
    <Divider sx={{ bgcolor: "rgba(255, 255, 255, 0.15)" }} />
  </>
);
