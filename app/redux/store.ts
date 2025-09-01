import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./reducers/userReducer";
import surveyReducer from "./reducers/surveyReducer";

export const makeStore = () => {
	return configureStore({
		reducer: {
			user: userReducer,
			survey: surveyReducer,
		},
	});
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
