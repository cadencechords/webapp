import { createSlice } from '@reduxjs/toolkit';

const initialState = {};
export const subscriptionSlice = createSlice({
  name: 'subscription',
  initialState,
  reducers: {
    setSubscription: (state, action) => {
      state.subscription = action.payload;
      state.subscription.isPro = action.payload?.is_pro;
    },
  },
});

export const { setSubscription } = subscriptionSlice.actions;

export default subscriptionSlice.reducer;

export const selectCurrentSubscription = state =>
  state.subscription.subscription;
