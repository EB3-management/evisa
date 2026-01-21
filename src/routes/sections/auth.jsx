import { Outlet } from "react-router";
import { lazy, Suspense } from "react";

import { AuthCenteredLayout } from "src/layouts/auth-centered";

import { SplashScreen } from "src/components/loading-screen";

import { AuthGuard, GuestGuard } from "src/auth/guard";
import { FormCenteredLayout } from "src/layouts/auth-centered/form-layout";
import { PermissionGuard } from "src/components/onboarding/permission-guard";

// ----------------------------------------------------------------------

const SignInPage = lazy(() => import("src/pages/auth/sign-in"));
const SignUpPage = lazy(() => import("src/pages/auth/sign-up"));
const EligibilityPage = lazy(() =>
  import("src/pages/auth/eligibility-form/eligibility-form")
);
const VerifyEmailPage = lazy(() =>
  import("src/pages/auth/verify-email")
);
const VerifyEmailSuccessPage = lazy(() =>
  import("src/pages/auth/verify-email-success")
);

const TermsAndConditionPage = lazy(() =>
  import("src/pages/auth/term-and-condition")
);

// ----------------------------------------------------------------------

export const authRoutes = [
  {
    path: "auth",
    element: (
      <Suspense fallback={<SplashScreen />}>
        <Outlet />
      </Suspense>
    ),
    children: [
      {
        path: "sign-in",
        element: (
          <GuestGuard>
            <AuthCenteredLayout
              slotProps={{
                section: { title: "Book an Appointment" },
              }}
            >
              <SignInPage />
            </AuthCenteredLayout>
          </GuestGuard>
        ),
      },
      {
        path: "sign-up",
        element: (
          <GuestGuard>
            <AuthCenteredLayout>
              <SignUpPage />
            </AuthCenteredLayout>
          </GuestGuard>
        ),
      },
      {
        path: "terms-and-conditions",
        element: (
          <GuestGuard>
            <FormCenteredLayout>
              <TermsAndConditionPage />
            </FormCenteredLayout>
          </GuestGuard>
        ),
      },

      {
        path: "register-step-form",
        element: (
          <AuthGuard>
            <PermissionGuard feature="eligibility_form">
              <FormCenteredLayout>
                <EligibilityPage />
              </FormCenteredLayout>
            </PermissionGuard>
          </AuthGuard>
        ),
      },

       {
        path: "verify-email",
        element: (
          <AuthGuard>
            <FormCenteredLayout>
              <VerifyEmailPage />
            </FormCenteredLayout>
          </AuthGuard>
        ),
      },

      {
        path: "verify-email-success",
        element: <VerifyEmailSuccessPage />,
      },
    ],
  },
];
