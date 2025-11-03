import { useCallback } from "react";

import { Button } from "@mui/material";

import { paths } from "src/routes/paths";
import { useRouter } from "src/routes/hooks";

import { useAppDispatch } from "src/redux/hooks";
import { clearOrganization } from "src/redux/actions";

import { DashboardContent } from "src/layouts/dashboard";

import { CustomBreadcrumbs } from "src/components/custom-breadcrumbs";
import { Iconify } from "src/components/iconify";
import { toast } from "src/components/snackbar";

import { signOut } from "src/api";
import { ProfileGeneral } from "./profile-general";


// ----------------------------------------------------------------------

export function ProfileView() {
  const router = useRouter();

  const dispatch = useAppDispatch();

  const handleLogout = useCallback(async () => {
    try {
      const response = await signOut();

      dispatch(clearOrganization());

      router.push(paths.home);

      toast.success(response.message || "You have been logged out!");
    } catch (error) {
      console.error(error);

      toast.error("Unable to logout!");
    }
  }, [router]);

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Profile"
        links={[
          { name: "Dashboard", href: paths.dashboard.root },
          { name: "Profile" },
        ]}
        action={
          <Button
            color="error"
            variant="soft"
            startIcon={<Iconify icon="solar:logout-3-bold" />}
            onClick={handleLogout}
          >
            Logout
          </Button>
        }
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <ProfileGeneral />
    </DashboardContent>
  );
}
