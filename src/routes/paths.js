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
    detail: (id) => `${ROOTS.DASHBOARD}/payment-detail/${id}`,
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

    profile: {
      root: `${ROOTS.DASHBOARD}/profile`,
    },

    leadDetail: {
      detail: (id) => `${ROOTS.DASHBOARD}/lead-detail/${id}`,
    },

    appointment: {
      root: `${ROOTS.DASHBOARD}/appointment`,
    },

    faqs: {
      root: `${ROOTS.DASHBOARD}/faqs`,
    },
  },
};
