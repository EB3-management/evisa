import { list } from "src/theme/core/components/list";

const ROOTS = {
  AUTH: "/auth",
  AUTH_DEMO: "/auth-demo",
  DASHBOARD: "/dashboard",
};

// ----------------------------------------------------------------------

export const paths = {
  home: "/",
  // AUTH
  auth: {
    signIn: `${ROOTS.AUTH}/sign-in`,
    signUp: `${ROOTS.AUTH}/sign-up`,
  },
  // eligibility: "/register-step-form",

  onBoardingForm: {
    form: (id) => `/ebform/${id}`,
    formPath: "/form",
  },

  // DASHBOARD
  dashboard: {
    root: ROOTS.DASHBOARD,
    plan: `${ROOTS.DASHBOARD}/plan`,
    detail: (id) => `${ROOTS.DASHBOARD}/plan-detail/${id}`,
    finance: `${ROOTS.DASHBOARD}/finance`,

    documents: {
      root: `${ROOTS.DASHBOARD}/documents`,
      // detail
    },

    contract: {
      root: `${ROOTS.DASHBOARD}/contracts`,
    },

    progress: {
      root: `${ROOTS.DASHBOARD}/progress`,
    },

    lead: {
      root: `${ROOTS.DASHBOARD}/lead`,
    },

    vacancy: {
      root: `${ROOTS.DASHBOARD}/vacancy`,
      detail: (id) => `${ROOTS.DASHBOARD}/vacancy-detail/${id}`,
    },

    payment: {
      root: `${ROOTS.DASHBOARD}/payment`,
    },

    formTemplate: {
      root: `${ROOTS.DASHBOARD}/form-template`,
      create: `${ROOTS.DASHBOARD}/form-template/create`,
      detail: (id) => `${ROOTS.DASHBOARD}/form-template/${id}`,
      edit: (id) => `${ROOTS.DASHBOARD}/form-template/${id}/edit`,
    },

    profile: {
      root: `${ROOTS.DASHBOARD}/profile`,
    },

    leadDetail: {
      detail: (id) => `${ROOTS.DASHBOARD}/lead-detail/${id}`,
    },

    employee: {
      root: `${ROOTS.DASHBOARD}/employee`,
      create: `${ROOTS.DASHBOARD}/employee/create`,
      detail: (id) => `${ROOTS.DASHBOARD}/employee/${id}`,
      edit: (id) => `${ROOTS.DASHBOARD}/employee/${id}/edit`,
    },

    appointment: {
      root: `${ROOTS.DASHBOARD}/appointment`,
      category: `${ROOTS.DASHBOARD}/appointment/category`,
      timeSlot: `${ROOTS.DASHBOARD}/appointment/time-slot`,
    },

    creditLogs: {
      root: `${ROOTS.DASHBOARD}/credit-logs`,
    },

    attendance: {
      root: `${ROOTS.DASHBOARD}/attendance-report`,
    },

    reports: {
      root: `${ROOTS.DASHBOARD}/reports/team-report`,
      transaction: `${ROOTS.DASHBOARD}/reports/transaction-report`,
      smsReport: `${ROOTS.DASHBOARD}/reports/sms-report`,
      topupReport: `${ROOTS.DASHBOARD}/reports/topup-report`,
      packageReport: `${ROOTS.DASHBOARD}/reports/package-report`,
      creditReport: `${ROOTS.DASHBOARD}/reports/credit-report`,
    },
  },
};
