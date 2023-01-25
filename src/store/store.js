import alertReducer from './alertSlice';
import authReducer from './authSlice';
import { configureStore } from '@reduxjs/toolkit';
import presenterReducer from './presenterSlice';
import subscriptionReducer from './subscriptionSlice';

export default configureStore({
  reducer: {
    auth: authReducer,
    alert: alertReducer,
    presenter: presenterReducer,
    subscription: subscriptionReducer,
  },
});
