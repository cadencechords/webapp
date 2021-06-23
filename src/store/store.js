import { configureStore } from "@reduxjs/toolkit";
import alertReducer from "./alertSlice";
import authReducer from "./authSlice";
import editorReducer from "./editorSlice";
import presenterReducer from "./presenterSlice";

export default configureStore({
	reducer: {
		auth: authReducer,
		editor: editorReducer,
		alert: alertReducer,
		presenter: presenterReducer,
	},
});
