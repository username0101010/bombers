import { all } from "redux-saga/effects";

import watchUserCreate from "./watchUserCreate";
import watchUserFetchData from "./watchUserFetchData";
import watchProfileFetchData from "./watchProfileFetchData";
import watchRatingFetchUsers from "./watchRatingFetchUsers";
import watchProfileFetchMatches from "./watchProfileFetchMatches";
import watchProfileFetchStatistic from "./watchProfileFetchStatistic";

export default function* rootSaga() {
    yield all([
        watchUserFetchData(),
        watchUserCreate(),
        watchRatingFetchUsers(),
        watchProfileFetchData(),
        watchProfileFetchMatches(),
        watchProfileFetchStatistic()
    ]);
};
