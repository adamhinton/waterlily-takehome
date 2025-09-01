"use client";

// README
// Per redux docs, this creates a new store instance every time a request is made. See store.ts for more info.

import React, { useRef } from "react";
import { makeStore, AppStore } from "./store";
import { Provider } from "react-redux";

export default function ReduxStoreProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	// Redux docs don't include the `undefined` bit, but I got an error saying it expected 1 argument but got 0.
	const storeRef = useRef<AppStore | undefined>(undefined);
	if (!storeRef.current) {
		// Create the store instance the first time this renders
		storeRef.current = makeStore();
	}

	return <Provider store={storeRef.current}>{children}</Provider>;
}
