import { Outlet } from "react-router";
import { lazy, Suspense } from "react";

import { DashboardLayout } from "src/layouts/dashboard";

import { LoadingScreen } from "src/components/loading-screen";

import { AuthGuard } from "src/auth/guard";
import { PermissionGuard } from "src/components/onboarding/permission-guard";
import { OnboardingRedirectGuard } from "src/components/onboarding/onboarding-redirect-guard";

import { usePathname } from "../hooks";

// ----------------------------------------------------------------------

// Overview
const IndexPage = lazy(() => import("src/pages/dashboard"));

//vacancy
const VacancyDetailPage = lazy(() =>
  import("src/pages/dashboard/vacancy/detail")
);

const VacancyPage = lazy(() => import("src/pages/dashboard/vacancy/list"));

const PlanPage = lazy(() => import("src/pages/dashboard/plan/list"));
const PlanDetailPage = lazy(() => import("src/pages/dashboard/plan/detail"));
const FinancePage = lazy(() => import("src/pages/dashboard/plan/finance"));
const ProgressPage = lazy(() => import("src/pages/dashboard/progress/list"));

//documents
const DocumentPage = lazy(() => import("src/pages/dashboard/document/list"));

//contract
const ContractPage = lazy(() => import("src/pages/dashboard/contract/list"));

// Appointment
const PaymentListPage = lazy(() => import("src/pages/dashboard/payment/list"));

// Profile
const ProfilePage = lazy(() => import("src/pages/dashboard/profile/profile"));

// visastatus
const VisaStatusPage = lazy(() =>
  import("src/pages/dashboard/visa-status/list")
);

// faqs
const FaqsPage = lazy(() => import("src/pages/dashboard/faqs/list"));

// guide
const GuidePage = lazy(() => import("src/pages/dashboard/faqs/guide"));

// ----------------------------------------------------------------------

function SuspenseOutlet() {
  const pathname = usePathname();
  return (
    <Suspense key={pathname} fallback={<LoadingScreen />}>
      <Outlet />
    </Suspense>
  );
}

const dashboardLayout = () => (
  <DashboardLayout>
    <SuspenseOutlet />
  </DashboardLayout>
);

export const dashboardRoutes = [
  {
    path: "dashboard",
    element: (
      <AuthGuard>
        <OnboardingRedirectGuard>
          {dashboardLayout()}
        </OnboardingRedirectGuard>
      </AuthGuard>
    ),
    children: [
      { 
        index: true, 
        element: (
          <PermissionGuard feature="dashboard">
            <IndexPage />
          </PermissionGuard>
        ) 
      },

      {
        path: "vacancy-detail",
        children: [{ 
          path: ":id", 
          element: (
            <PermissionGuard feature="job_selection">
              <VacancyDetailPage />
            </PermissionGuard>
          ) 
        }],
      },
      {
        path: "vacancy",
        element: (
          <PermissionGuard feature="job_selection">
            <VacancyPage />
          </PermissionGuard>
        ),
      },
      {
        path: "plan",
        children: [{ 
          path: ":id", 
          element: (
            <PermissionGuard feature="financial_plan">
              <PlanPage />
            </PermissionGuard>
          ) 
        }],
      },
      {
        path: "payment-detail",
        children: [{ 
          path: ":id", 
          element: (
            <PermissionGuard feature="financial_plan">
              <PlanDetailPage />
            </PermissionGuard>
          ) 
        }],
      },
      {
        path: "finance",
        element: (
          <PermissionGuard feature="financial_plan">
            <FinancePage />
          </PermissionGuard>
        ),
      },
      {
        path: "progress",
        element: (
          <PermissionGuard feature="dashboard">
            <ProgressPage />
          </PermissionGuard>
        ),
      },
      { 
        path: "documents", 
        element: (
          <PermissionGuard feature="documents">
            <DocumentPage />
          </PermissionGuard>
        ) 
      },
      { 
        path: "contracts", 
        element: (
          <PermissionGuard feature="contract">
            <ContractPage />
          </PermissionGuard>
        ) 
      },

      {
        path: "payment",
        children: [{ 
          index: true, 
          element: (
            <PermissionGuard feature="payment">
              <PaymentListPage />
            </PermissionGuard>
          ) 
        }],
      },
      { 
        path: "faqs", 
        element: (
          <PermissionGuard feature="dashboard">
            <FaqsPage />
          </PermissionGuard>
        ) 
      },
      { 
        path: "profile", 
        element: (
          <PermissionGuard feature="dashboard">
            <ProfilePage />
          </PermissionGuard>
        ) 
      },
      { 
        path: "visa-status", 
        element: (
          <PermissionGuard feature="visa_status">
            <VisaStatusPage />
          </PermissionGuard>
        ) 
      },
      { 
        path: "guide", 
        element: (
          <PermissionGuard feature="dashboard">
            <GuidePage />
          </PermissionGuard>
        ) 
      },
    ],
  },
];
