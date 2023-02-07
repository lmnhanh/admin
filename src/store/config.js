import { configureStore } from "@reduxjs/toolkit";
import persistReducer from "redux-persist/es/persistReducer";
import appReducer from "./slices";
import storage from 'redux-persist/lib/storage';
import thunk from 'redux-thunk';
import persistStore from "redux-persist/es/persistStore";
import autoMergeLevel2 from "redux-persist/es/stateReconciler/autoMergeLevel2";

const persistConfig = {
  key: 'app',
  storage,
  blacklist: ['toggleSidebar'],
  stateReconciler: autoMergeLevel2
}

const persistedReducer = persistReducer(persistConfig, appReducer)

export const store = configureStore({
  reducer: {
    app: persistedReducer
  },
  middleware: [thunk]
  // devTools: process.env.NODE_ENV !== 'production'
});

export const persistor = persistStore(store)