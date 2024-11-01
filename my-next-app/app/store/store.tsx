import { configureStore } from "@reduxjs/toolkit";
import { vehiclesApi } from "./api/vehicleapi";
import darkModeReducer from "./slices/darkModeSlices";

export const store = configureStore({
  reducer: {
    [vehiclesApi.reducerPath]: vehiclesApi.reducer,
    darkMode: darkModeReducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(vehiclesApi.middleware)
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
