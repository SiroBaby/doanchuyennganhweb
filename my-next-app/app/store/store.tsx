import { configureStore } from "@reduxjs/toolkit";
import { vehiclesApi } from "./api/vehicleapi";
import { usersApi } from "./api/userapi";
import darkModeReducer from "./slices/darkModeSlices";

export const store = configureStore({
  reducer: {
    [vehiclesApi.reducerPath]: vehiclesApi.reducer,
    [usersApi.reducerPath]: usersApi.reducer,
    darkMode: darkModeReducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(vehiclesApi.middleware)
      .concat(usersApi.middleware)
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
