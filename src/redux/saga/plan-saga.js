import { all, call, put, takeLatest } from "redux-saga/effects";
import { fetchFinancePlan } from "src/api/plan";
import {
  fetchFinancePlanFailure,
  fetchFinancePlanRequest,
  fetchFinancePlanSuccess,
} from "../actions";

function* fetchFinancePlanSaga() {
  try {
    const response = yield call(fetchFinancePlan);

    // fetchFinancePlan returns response.data which is the array
    // So we can use it directly

    yield put(fetchFinancePlanSuccess(response || []));
  } catch (error) {
    yield put(fetchFinancePlanFailure());
  }
}

// function* fetchEmployeeDetailSaga({ payload }) {
//   try {
//     const response = yield call(fetchEmployeeDetail, payload);

//     yield put(fetchEmployeeDetailSuccess(response));
//   } catch (error) {
//     yield put(fetchEmployeeDetailFailure());
//   }
// }

export function* watchPlanSaga() {
  yield all([takeLatest(fetchFinancePlanRequest, fetchFinancePlanSaga)]);
}
