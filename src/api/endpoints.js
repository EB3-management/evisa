export const endpoints = {
  auth: {
    signIn: "login",
    signUp: "register",
    signOut: "logout",
    country: "country",
  },

  vacancy: {
    eligibilityForm: "eligibility/save-eligibility-form",
    list: "vacancy",
    detail: (id) => `vacancy/show/${id}`,
  },
  plan: {
    list: "finance-plan",
    assign: (id) => `finance-plan/assign-plan/${id}`,
    financeList: "finance-plan/list-assigned-plans",
  },
  document: {
    list: "documents",
    store: "documents/store",
    delete: (id) => `documents/delete/${id}`,
  },
  contract: {
    list: "contracts",
    show: "employee-contract/show",
    upload: "employee-contract/upload",
    sign: (id) => `contracts/sign/${id}`,
  },

  profile: {
    get: "employee-profile/view-profile",
    update: "organization/updateOrganization",
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
  },

  employee: {
    list: "/user",
    create: "user/store",
    detail: (id) => `user/show/${id}`,
    update: (id) => `user/update/${id}`,
  },

  telecommunication: {
    providers: "/telcos",
    dataPack: {
      ncell: "data-pack/ncell",
      ntc: "data-pack/ntc",
    },
    topUpAmount: "top-amount",
  },

  topUpAmount: "top-amount",

  formTemplate: {
    create: "form-template/store",
    list: "form-template",
    detail: (id) => `form-template/show/${id}`,
    update: (id) => `form-template/update/${id}`,
    validationRule: "validation-rule",
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

    // category: {
    //   create: "appointment-category/store",
    //   list: "appointment-category",
    //   detail: (id) => `appointment-category/show/${id}`,
    //   update: (id) => `appointment-category/update/${id}`,
    // },

    // timeSlot: {
    //   create: "appointment-slot/store",
    //   list: "appointment-slot",
    //   detail: (id) => `appointment-slot/show/${id}`,
    //   update: (id) => `appointment-slot/update/${id}`,
    // },
  },

  creditLogs: {
    list: "organization-credit-log",
  },

  public: {
    key: "rsa/public-key",
  },

  siteSettings: {
    get: "site-setting",
  },

  hr: {
    nepaliDates: "nepali-date",
    attendance: "monthly-report",
  },
  reports: {
    teamReports: "report/team",
    transactions: "report/transaction",
    sms: "report/sms",
    topup: "report/topup",
    package: "report/package",
    credit: "report/credits",
  },
};
