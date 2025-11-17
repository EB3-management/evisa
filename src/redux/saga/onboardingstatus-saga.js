import { all, call, put, takeLatest } from "redux-saga/effects";
import { fetchOnBoardingStatus } from "src/api/onboardingform";
import {
  fetchOnBoardingFailure,
  fetchOnBoardingRequest,
  fetchOnBoardingSuccess,
} from "../actions";

function* fetchOnboardingSaga({ payload }) {
  try {
    const response = yield call(fetchOnBoardingStatus, payload);

    // Extract the nested data from response.data.data
    // const profileData = response?.data?.data || {};
    console.log("this is onboarding response", response);
    yield put(fetchOnBoardingSuccess(response));
  } catch (error) {
    yield put(fetchOnBoardingFailure());
  }
}

export function* watchOnBoardingSaga() {
  yield all([takeLatest(fetchOnBoardingRequest, fetchOnboardingSaga)]);
}
