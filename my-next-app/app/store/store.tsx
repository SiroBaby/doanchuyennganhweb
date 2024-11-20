import { configureStore } from "@reduxjs/toolkit";
import { vehiclesApi } from "./api/vehicleapi";
import { usersApi } from "./api/userapi";
import { tourApi } from "./api/tourapi";
import { orderApi } from "./api/orderapi";
import { dashboardApi } from "./api/dashboardapi";
import darkModeReducer from "./slices/darkModeSlices";

export const store = configureStore({
  reducer: {
    [vehiclesApi.reducerPath]: vehiclesApi.reducer,
    [usersApi.reducerPath]: usersApi.reducer,
    [tourApi.reducerPath]: tourApi.reducer,
    [orderApi.reducerPath]: orderApi.reducer,
    [dashboardApi.reducerPath]: dashboardApi.reducer,
    darkMode: darkModeReducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(vehiclesApi.middleware)
      .concat(usersApi.middleware)
      .concat(tourApi.middleware)
      .concat(orderApi.middleware)
      .concat(dashboardApi.middleware)
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
