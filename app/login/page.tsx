// README
// This is the source of truth for auth in this application (obviously)
// At this time we are only using Google Sign-In for authentication, no passwords or anything
// User will also be able to save vehicles locally (localhost) without an account

"use client";

// AUTH TODO:
// Work darkmode in to auth user data

import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
	useEffect(() => {
		// Dynamically load the Google GSI scriptNo
		const script = document.createElement("script");
		script.src = "https://accounts.google.com/gsi/client";
		script.async = true;
		script.defer = true;
		document.body.appendChild(script);
		return () => {
			document.body.removeChild(script);
		};
	}, []);

	return (
		<main className="min-h-screen flex flex-col justify-center items-center p-4 transition-colors duration-200">
			{/* {isLoggedIn && <h1>Welcome, {loggedInUser?.email}!</h1>} */}
			{
				<div className="rounded-lg shadow-lg p-8 w-full max-w-md mx-auto transition-colors duration-200">
					<h1
						className="text-2xl md:text-3xl font-bold mb-6 text-center"
						aria-label="Sign in with Google"
					>
						Sign in with Google
					</h1>
					{/* {isMounted && ( */}
					<div
						className="space-y-4"
						role="region"
						aria-label="Google sign in options"
					>
						{/* Google GSI auto-generated div */}
						<div
							id="g_id_onload"
							data-client_id="58303057671-hcg83okogp9kov35m1g936l127qsouc3.apps.googleusercontent.com"
							data-context="signin"
							data-ux_mode="popup"
							data-callback="handleSignInWithGoogle"
							data-auto_prompt="false"
						></div>

						<div
							className="g_id_signin"
							data-type="standard"
							data-shape="rectangular"
							data-theme="outline"
							data-text="signin_with"
							data-size="large"
							data-logo_alignment="left"
						></div>
					</div>
				</div>
			}
		</main>
	);
}

// Google's auth API expects this function to be in the global scope
// DO NOT CHANGE THIS FUNCTION NAME, ITS NAME IS REFERENCED IN THE GOOGLE GSI SCRIPT
// Google's API calls this function when the user signs in
// @ts-expect-error - wasn't sure what to type this, Google's docs didn't specify
globalThis.handleSignInWithGoogle = async function handleSignInWithGoogle(
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	response: any
) {
	const supabase = createClient();

	// Retrieve signed in user info
	const signedInUser = await supabase.auth.getUser();
	console.log("signedInUser:", signedInUser);

	const { data, error } = await supabase.auth.signInWithIdToken({
		provider: "google",
		token: response.credential,
	});

	if (error) {
		console.error("Error signing in with Google:", error.message);
	} else {
		console.log("Successfully signed in with Google:", data);
	}
};
