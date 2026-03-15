import storage from "redux-persist/lib/storage";
import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer , PERSIST, REHYDRATE, REGISTER } from "redux-persist";
import createSagaMiddleware from "redux-saga";

import { rootReducer } from "./reducer";

import { rootSaga } from "./saga";

const persistConfig = {
  key: "primary",
  storage,
  whitelist: ["auth", "vacancy"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const sagaMiddleware = createSagaMiddleware();

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [PERSIST, REHYDRATE, REGISTER],
      },
    }).concat(sagaMiddleware),
});

sagaMiddleware.run(rootSaga);

const persistor = persistStore(store);

export default store;

export { persistor };
