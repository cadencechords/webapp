import { createSlice } from "@reduxjs/toolkit";

const initialState = {};
export const subscriptionSlice = createSlice({
	name: "subscription",
	initialState,
	reducers: {
		setSubscription: (state, action) => {
			state.subscription = action.payload;
			state.subscription.isPro =
				action.payload.stripe_price_id === process.env.REACT_APP_PRO_PRICE_ID;
		},
	},
});

export const { setSubscription } = subscriptionSlice.actions;

export default subscriptionSlice.reducer;

export const selectCurrentSubscription = (state) => state.subscription.subscription;
