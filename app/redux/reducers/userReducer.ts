import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type User = {
	id: string | null;
	email: string | null;
	isDarkMode: boolean;
};

const initialState: { value?: User } = {
	value: undefined,
};

const userSlice = createSlice({
	name: "user",
	initialState,
	reducers: {
		setUser: (state, action: PayloadAction<User | undefined>) => {
			state.value = action.payload;
		},
		clearUser: (state) => {
			state.value = undefined;
		},
	},
});

export const { setUser, clearUser } = userSlice.actions;

export default userSlice.reducer;
