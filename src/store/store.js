import alertReducer from "./alertSlice";
import authReducer from "./authSlice";
import cacheReducer from "./cacheSlice";
import { configureStore } from "@reduxjs/toolkit";
import editorReducer from "./editorSlice";
import presenterReducer from "./presenterSlice";
import subscriptionReducer from "./subscriptionSlice";

export default configureStore({
	reducer: {
		auth: authReducer,
		editor: editorReducer,
		alert: alertReducer,
		presenter: presenterReducer,
		subscription: subscriptionReducer,
		cache: cacheReducer,
	},
});
