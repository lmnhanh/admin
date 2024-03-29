import {configureStore } from "@reduxjs/toolkit";
import persistReducer from "redux-persist/es/persistReducer";
import appReducer,{authReducer} from "./slices";
import storage from 'redux-persist/lib/storage';
import thunk from 'redux-thunk';
import persistStore from "redux-persist/es/persistStore";
import autoMergeLevel2 from "redux-persist/es/stateReconciler/autoMergeLevel2";
import { categoryReducer } from "./categorySlice";
import { venderReducer } from "./venderSlice";
import { productReducer } from './productSlice';
import { invoiceReducer } from "./invoiceSlice";
import { orderReducer } from './orderSlice';
import { partnerReducer } from './partnerSlice';
import { promotionReducer } from './promotionSlice';

const appPersistConfig = {
  key: 'app',
  storage,
  blacklist: ['toggleSidebar','refresh'],
  stateReconciler: autoMergeLevel2
}

const authPersistConfig = {
  key: 'auth',
  storage: storage,
  blacklist: [],
  stateReconciler: autoMergeLevel2
}

const persistedAppReducer = persistReducer(appPersistConfig, appReducer)
const persistedAuthReducer = persistReducer(authPersistConfig, authReducer)

export const store = configureStore({
  reducer: {
    app: persistedAppReducer,
    auth: persistedAuthReducer,
    category: categoryReducer,
    product: productReducer,
    vender: venderReducer,
    invoice: invoiceReducer,
    order: orderReducer,
    partner: partnerReducer,
    promotion: promotionReducer
  },
  middleware: [thunk],
  devTools: process.env.NODE_ENV !== 'production'
});

export const persistor = persistStore(store)