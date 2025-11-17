import { all } from "redux-saga/effects";

import { watchFormTemplateSaga } from "./form-template-saga";

import { watchProfileSaga } from "./profile-saga";

import { watchLeadDetailSaga } from "./leaddetail-saga";

import { watchEmployeeSaga } from "./employee-saga";

import { watchPermissionSaga } from "./permission-saga";

import { watchAppointmentSaga } from "./appointment-saga";

import { watchVacancySaga } from "./vacancy-saga";
import { watchSiteSettingSaga } from "./site-setting-saga";
import { watchReportSaga } from "./report-saga";
import { watchOnBoardingSaga } from "./onboardingstatus-saga";
import { watchDocumentsSaga } from "./documents-saga";
import { watchPlanSaga } from "./plan-saga";

export function* rootSaga() {
  yield all([
    watchFormTemplateSaga(),

    watchProfileSaga(),

    watchLeadDetailSaga(),

    watchEmployeeSaga(),

    watchPermissionSaga(),

    watchAppointmentSaga(),

    watchSiteSettingSaga(),

    watchReportSaga(),

    watchOnBoardingSaga(),

    watchDocumentsSaga(),

    watchVacancySaga(),

    watchPlanSaga(),
  ]);
}
