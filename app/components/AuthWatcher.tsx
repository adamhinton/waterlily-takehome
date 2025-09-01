"use client";

// README
// This component exists solely to watch for auth events (login, logout etc) and update Redux state
// It wraps around its children so that the children don't render until the auth state is known
// This component has no UI, it's just a wrapper

import { createClient } from "@/lib/supabase/client";
import { ReactNode, useEffect, useState } from "react";
import { useAppDispatch } from "../redux/hooks";
import { setSurvey } from "../redux/reducers/surveyReducer";
import { redirect, useRouter } from "next/navigation";
import { setUser } from "../redux/reducers/userReducer";
import {
	Survey,
	SurveyAnswer,
	SurveyQuestion,
} from "../utils/types/SurveyTypes";

interface AuthWatcherProps {
	children: ReactNode;
}

const AuthWatcher = ({ children }: AuthWatcherProps) => {
	const supabase = createClient();
	const dispatch = useAppDispatch();
	const [authInitialized, setAuthInitialized] = useState(false);
	const router = useRouter();

	useEffect(() => {
		const fetchAndSetUserSurvey = async (userId: string) => {
			// Fetch surveys from api endpoint
			try {
				// Fetch survey with id=1 (the only survey in our app per requirements)
				const surveyResponse = await fetch("/api/survey?id=1");
				const surveyAnswersResponse = await fetch("/api/survey_answers");

				const surveyAnswers = await surveyAnswersResponse.json();

				console.log("surveyAnswers:", surveyAnswers);

				// If there are survey answers, add them to the survey data and redirect to /survey/complete
				if (
					surveyAnswers &&
					Array.isArray(surveyAnswers) &&
					surveyAnswers.length > 0
				) {
					// Add answers to survey questions
					const surveyData: Survey = await surveyResponse.json();
					if (surveyData && surveyData.survey_questions) {
						surveyData.survey_questions = surveyData.survey_questions.map(
							(question: SurveyQuestion) => {
								const answer = surveyAnswers.find(
									(a: SurveyAnswer) => a.survey_question_id === question.id
								);
								if (answer) {
									question.answer = answer;
								}
								return question;
							}
						);
					}
					dispatch(setSurvey({ ...surveyData }));
					// Get current URL; if it's already survey/complete, don't redirect
					// const currentPath = window.location.pathname;
					// if (currentPath === "/survey/complete") {
					// 	return;
					/`/ }
					// User has a completed survey, so forward them to the review page
					// This was originally a redirect but those aren't supposed to be used in useEffect, according to Copilot
					// router.push("/survey/complete");
					// return;
				}

				if (!surveyResponse.ok) {
					throw new Error(
						`Failed to fetch survey: ${surveyResponse.statusText}`
					);
				}

				const surveyData = await surveyResponse.json();
				console.log("blah blah blah");

				// Dispatch survey data to Redux store
				dispatch(setSurvey({ ...surveyData }));

				console.log("surveyData:", surveyData);

				console.log("Survey data loaded for user:", userId);
			} catch (error) {
				console.error("Error fetching survey data:", error);
			}
		};
		// TODO get user's surveys and set to state

		// Check if there's an initial session on first load
		const initializeAuth = async () => {
			const { data } = await supabase.auth.getSession();

			if (data.session) {
				// User is already logged in
				dispatch(
					setUser({
						id: data.session.user.id,
						email: data.session.user.email!,
						isDarkMode: true,
					})
				);
				// TODO set surveys to state
			}

			// Indicate auth is initialized whether user is logged in or not
			setAuthInitialized(true);
		};

		// Check if there's a logged in user on first load and set them to state if they exist
		initializeAuth();

		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange((event, session) => {
			if (event === "SIGNED_IN") {
				console.log("SIGNED_IN");
				dispatch(
					setUser({
						id: session!.user.id,
						email: session!.user.email!,
						isDarkMode: false,
					})
				);
				fetchAndSetUserSurvey(session!.user.id);
				redirect("/survey");
			} else if (event === "SIGNED_OUT") {
				// Nothing needed here for MVP
			} else if (event === "TOKEN_REFRESHED") {
				// Handle token refresh event
				console.log("Token refreshed:", session);
			} else if (event === "USER_UPDATED") {
				// Handle user update event

				dispatch(
					setUser({
						id: session!.user.id,
						email: session!.user.email!,
						isDarkMode: true,
					})
				);

				console.log("User updated:", session);
			} else if (event === "PASSWORD_RECOVERY") {
				// Handle password recovery event
				console.log("Password recovery event", session);
			} else if (event === "INITIAL_SESSION") {
				// INITIAL_SESSION is page first loading, among other things
				console.log("INITIAL SESSION");

				if (!session) {
					return;
				}

				dispatch(
					setUser({
						id: session!.user.id,
						email: session!.user.email!,
						isDarkMode: false,
					})
				);
				fetchAndSetUserSurvey(session!.user.id);
			}
		});

		// Unsubscribe from the listener when the component unmounts
		return () => {
			subscription.unsubscribe();
		};
	}, [supabase.auth, supabase, dispatch, router]);

	// Only render children when auth is initialized
	if (!authInitialized) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="text-center">
					<h2 className="mb-2 text-xl font-semibold">Loading...</h2>
					<p>Checking authentication status</p>
				</div>
			</div>
		);
	}

	return <>{children}</>;
};

export default AuthWatcher;
