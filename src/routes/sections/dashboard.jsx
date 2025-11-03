import { Outlet } from "react-router";
import { lazy, Suspense } from "react";

import { DashboardLayout } from "src/layouts/dashboard";

import { LoadingScreen } from "src/components/loading-screen";

import { AuthGuard } from "src/auth/guard";

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

// faqs
const FaqsPage = lazy(() => import("src/pages/dashboard/faqs/list"));

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
    element: <AuthGuard>{dashboardLayout()}</AuthGuard>,
    children: [
      { index: true, element: <IndexPage /> },

      {
        path: "vacancy-detail",
        children: [{ path: ":id", element: <VacancyDetailPage /> }],
      },
      {
        path: "vacancy",
        element: <VacancyPage />,
      },
      {
        path: "plan",
        element: <PlanPage />,
      },
      {
        path: "payment-detail",
        children: [{ path: ":id", element: <PlanDetailPage /> }],
      },
      {
        path: "finance",
        element: <FinancePage />,
      },
      {
        path: "progress",
        element: <ProgressPage />,
      },
      { path: "documents", element: <DocumentPage /> },
      { path: "contracts", element: <ContractPage /> },

      {
        path: "payment",
        children: [{ index: true, element: <PaymentListPage /> }],
      },
      { path: "faqs", element: <FaqsPage /> },
      { path: "profile", element: <ProfilePage /> },
    ],
  },
];
