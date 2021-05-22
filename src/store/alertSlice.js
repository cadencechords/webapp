import { createSlice } from "@reduxjs/toolkit";

export const ALERT_TYPES = {
	MESSAGE: "message",
	ERROR: "error",
};

export const alertSlice = createSlice({
	name: "alert",
	initialState: {
		alertText: null,
		alertType: null,
	},

	reducers: {
		setAlert: (state, action) => {
			state.alertText = action.payload.alertText;
			const updatedAlertType = action.payload.alertType;
			if (ALERT_TYPES[updatedAlertType]) {
				state.alertType = updatedAlertType;
			} else {
				state.alertType = ALERT_TYPES.MESSAGE;
			}
		},

		clearAlert: (state) => {
			state.alertText = null;
			state.alertType = null;
		},
	},
});

export const { setAlert, clearAlert } = alertSlice.actions;

export default alertSlice.reducer;

export const selectAlert = (state) => {
	return { alertType: state.alert.alertType, alertText: state.alert.alertText };
};
