import authReducer from './authSlice';
import { configureStore } from '@reduxjs/toolkit';
import presenterReducer from './presenterSlice';
import subscriptionReducer from './subscriptionSlice';

const reducer = {
  auth: authReducer,
  presenter: presenterReducer,
  subscription: subscriptionReducer,
};

// A fresh store, optionally with preloaded state (used by tests).
export function setupStore(preloadedState) {
  return configureStore({ reducer, preloadedState });
}

export default setupStore();
