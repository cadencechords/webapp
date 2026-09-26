import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Subscription } from '../types';

export interface SubscriptionState {
  /** Unset until the current team loads. */
  subscription?: Subscription;
}

const initialState: SubscriptionState = {};
export const subscriptionSlice = createSlice({
  name: 'subscription',
  initialState,
  reducers: {
    setSubscription: (state, action: PayloadAction<Subscription>) => {
      state.subscription = action.payload;
      state.subscription.isPro = action.payload?.is_pro;
    },
  },
});

export const { setSubscription } = subscriptionSlice.actions;

export default subscriptionSlice.reducer;

export const selectCurrentSubscription = (state: {
  subscription: SubscriptionState;
}) => state.subscription.subscription;
