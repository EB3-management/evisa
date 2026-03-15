import { Outlet } from "react-router";
import { Suspense } from "react";

import { MainLayout } from "src/layouts/main";

import { SplashScreen } from "src/components/loading-screen";

// ----------------------------------------------------------------------

export const mainRoutes = [
  {
    element: (
      <Suspense fallback={<SplashScreen />}>
        <Outlet />
      </Suspense>
    ),
    children: [
      {
        element: (
          <MainLayout>
            <Outlet />
          </MainLayout>
        ),
      },
    ],
  },
];
