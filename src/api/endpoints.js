import { list } from "src/theme/core/components/list";

export const endpoints = {
  auth: {
    signIn: "login",
    signUp: "register",
    signOut: "logout",
    country: "country",
    emailLink: "email/verification-notification",
    emailVerify: "email/change",
  },

  vacancy: {
    eligibilityForm: "eligibility/save-eligibility-form",
    show: "eligibility/show-eligibility-form",
    list: "vacancy",
    detail: (id) => `vacancy/show/${id}`,
    applied: (id) => `vacancy/apply/${id}`,
    appliedVacancy: "vacancy/applied",
    visaCountry: "country/visa",
  },
  plan: {
    list: (id) => `finance-plan/${id}`,
    assign: (id) => `finance-plan/assign-plan/${id}`,
    financeList: "finance-plan/assigned-plans",
    detail: (id) => `finance-plan/assigned-plan/${id}`,
  },
  document: {
    list: "documents",
    store: "documents/store",
    delete: (id) => `documents/delete/${id}`,
    update: (id) => `documents/update/${id}`,
    type: "documents/document-types",
  },
  contract: {
    list: "contracts",
    show: "employee-contract/show",
    upload: "employee-contract/upload",
    sign: (id) => `contracts/sign/${id}`,
  },

  profile: {
    get: "employee-profile/view-profile",
  },

  form: {
    mainApplicantDetail: "onboarding-form/main-applicant",
    currentAddress: "onboarding-form/current-address",
    contactDetail: "onboarding-form/contact-detail",
    academicInformation: "onboarding-form/education",
    englishlanguage: "onboarding-form/english-proficiency",
    workExperiences: "onboarding-form/work-experience",
    dependentInformation: "onboarding-form/dependents",
    maritalStatus: "onboarding-form/marital",
    emergencyContact: "onboarding-form/emergency-contact",
    immigrationHistory: "onboarding-form/immigration-history",
    visa: "onboarding-form/visa-records",
    visaRejection: "onboarding-form/visa-rejections",
    immigrationIncident: "onboarding-form/immigration-incidents",
    criminalRecord: "onboarding-form/criminal-records",
    inadmissibility: "onboarding-form/inadmissibility",
    health: "onboarding-form/health",
    finalSubmit: "onboarding-form/final-submit",
    status: "onboarding-form/show-onboardingform-status",
    immigrationType: (id) => `onboarding-form/get-immigration-types/${id}`,
  },

  employee: {
    list: "/user",
    create: "user/store",
    detail: (id) => `user/show/${id}`,
    update: (id) => `user/update/${id}`,
  },

  visaStatus: {
    list: "employee-visa-status/status-list",
    visaLogStatus: "employee-visa-status",
  },

  lead: {
    create: "lead/store",
    list: "lead",
    detail: (id) => `lead/show/${id}`,
    updateStatus: (id) => `lead/update-status/${id}`,
    createActivity: (id) => `lead/activity/store/${id}`,
    activityList: (id) => `lead/activity/${id}`,
    createNotes: (id) => `lead/note/store/${id}`,
    updateNotes: (id) => `lead/note/update/${id}`,
    rewardLeads: (id) => `lead/re-reward-lead/${id}`,
    followupLeads: (id) => `lead/followup/store/${id}`,
  },

  transaction: {
    list: "organization-transaction",
  },

  permission: {
    allPermission: "navigation-menu",
    currentUserPermission: "navigation-menu/permissions",
    selectedEmployeePermission: (id) =>
      `navigation-menu/user-permissions/${id}`,
    updateSelectedEmployeePermission: "navigation-menu/permissions/edit",
  },

  appointment: {
    list: "appointments",
    create: "booked-appointments/store",
  },

  faqs: {
    list: "faqs",
    guide: "dashboard/guide",
    dashboard: "dashboard",
  },
  termCondition: {
    list: "dashboard/terms-and-conditions",
  },
};
