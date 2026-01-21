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
    termsAndConditions: `${ROOTS.AUTH}/terms-and-conditions`,
    verifyEmailSuccess: `${ROOTS.AUTH}/verify-email-success`,
  },
  // eligibility: "/register-step-form",

  onBoardingForm: {
    form: (id) => `/ebform/${id}`,
    formPath: "/form",
  },

  // DASHBOARD
  dashboard: {
    root: ROOTS.DASHBOARD,
    plana: `${ROOTS.DASHBOARD}/plan`,
    plan: (id) => `${ROOTS.DASHBOARD}/plan/${id}`,
    detail: (id) => `${ROOTS.DASHBOARD}/payment-detail/${id}`,
    finance: `${ROOTS.DASHBOARD}/finance`,

    documents: {
      root: `${ROOTS.DASHBOARD}/documents`,
      // detail
    },

    contract: {
      root: `${ROOTS.DASHBOARD}/contracts`,
      detail: (id) => `${ROOTS.DASHBOARD}/contract/${id}`,
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

    visaStatus: {
      root: `${ROOTS.DASHBOARD}/visa-status`,
    },

    guide: {
      root: `${ROOTS.DASHBOARD}/guide`,
    },
  },
};
