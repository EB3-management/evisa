import { combineSlices } from "@reduxjs/toolkit";

import { authSlice } from "./auth/auth-slice";

import { formTemplateSlice } from "./form-template/form-template-slice";

import { profileSlice } from "./profile/profile-slice";

import { leadSlice } from "./lead/leaddetail-slice";

import { employeeSlice } from "./employee/employee-slice";

import { permissionSlice } from "./permission/permission-slice";

import { appointmentSlice } from "./appointment/appointment-slice";

import { siteSettingSlice } from "./site-setting/site-setting-slice";
import { reportSlice } from "./reports/reports-slice";
import { onBoardingSlice } from "./onboardingstatus-slice";
import { documentsSlice } from "./documents/documents-slice";
import { vacancySlice } from "./vacancy/vacancy-slice";
import { planSlice } from "./plan/plan-slice";

export const rootReducer = combineSlices(
  authSlice,

  formTemplateSlice,

  profileSlice,

  leadSlice,

  employeeSlice,

  permissionSlice,

  appointmentSlice,

  siteSettingSlice,

  reportSlice,

  onBoardingSlice,

  documentsSlice,

  vacancySlice,

  planSlice
);
