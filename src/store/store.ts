import authReducer from './authSlice';
import { configureStore } from '@reduxjs/toolkit';
import presenterReducer from './presenterSlice';
import subscriptionReducer from './subscriptionSlice';

const reducer = {
  auth: authReducer,
  presenter: presenterReducer,
  subscription: subscriptionReducer,
};

/** The whole Redux state: each slice's state under its key. */
export type RootState = {
  [K in keyof typeof reducer]: ReturnType<(typeof reducer)[K]>;
};

// A fresh store, optionally with preloaded state (used by tests).
export function setupStore(preloadedState?: Partial<RootState>) {
  return configureStore({ reducer, preloadedState });
}

export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore['dispatch'];

export default setupStore();
