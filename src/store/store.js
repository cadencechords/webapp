import { configureStore } from "@reduxjs/toolkit";
import alertReducer from "./alertSlice";
import authReducer from "./authSlice";
import editorReducer from "./editorSlice";

export default configureStore({
	reducer: {
		auth: authReducer,
		editor: editorReducer,
		alert: alertReducer,
	},
});
