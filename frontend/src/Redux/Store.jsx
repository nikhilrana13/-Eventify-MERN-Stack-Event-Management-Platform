import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import sessionStorage from "redux-persist/lib/storage/session";
import { AuthSlice } from "./AuthSlice";
import persistStore from "redux-persist/es/persistStore";
import { EventSlice } from "./EventSlice";


const userpersistconfig = {
    key:"Auth",
    storage:sessionStorage
}

const persistconfiguser = persistReducer(userpersistconfig,AuthSlice.reducer);
const rootreducer = combineReducers({
    Auth:persistconfiguser,
    Event:EventSlice.reducer
})
export const store = configureStore({
    reducer:rootreducer,
    middleware:(getDefaultMiddleware) => getDefaultMiddleware({serializableCheck:false}),
})
export const persistor = persistStore(store)