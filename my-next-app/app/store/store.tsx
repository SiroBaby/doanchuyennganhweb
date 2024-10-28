import { configureStore } from "@reduxjs/toolkit";
import { usersApi } from "./api/users";
import { vehiclesApi } from "./api/vehicleapi";
import darkModeReducer from "./slices/darkModeSlices";

export const store = configureStore({
  reducer: {
    [usersApi.reducerPath]: usersApi.reducer,
    [vehiclesApi.reducerPath]: vehiclesApi.reducer,
    darkMode: darkModeReducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(usersApi.middleware)
      .concat(vehiclesApi.middleware)
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
