// This gets all of a user's survey answers
// Very simple endpoint to meet MVP for this project; simply GETS the answers, or POSTS new answers
// Uses the currently logged in user as reference, so no Request is needed

import { SurveyAnswer } from "@/app/utils/types/SurveyTypes";
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(): Promise<
	NextResponse<SurveyAnswer[]> | NextResponse<{ error: string }>
> {
	const supabase = await createClient();
	const userId = (await supabase.auth.getUser()).data.user?.id;

	if (!userId) {
		return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
	}

	const { data, error } = await supabase
		.from("survey_answer")
		.select("*")
		.eq("user_id", userId);

	if (error) {
		return NextResponse.json({ error: error.message }, { status: 500 });
	}

	// TODO get only unique survey answers, just one per survey_question

	// TODO stretch validate this
	return NextResponse.json(data as unknown as SurveyAnswer[]);
}

export async function POST(request: Request): // Nextresponse success or error
Promise<NextResponse<{ success: boolean }> | NextResponse<{ error: string }>> {
	const supabase = await createClient();
	const userId = (await supabase.auth.getUser()).data.user?.id;

	if (!userId) {
		return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
	}

	const requestBody = await request.json();

	const answers: SurveyAnswer[] = requestBody;

	console.log("Received answers in route.ts:", answers);

	const { error } = await supabase.from("survey_answer").upsert(
		answers.map((answer) => ({
			...answer,
			user_id: userId,
		}))
	);

	if (error) {
		return NextResponse.json({ error: error.message }, { status: 500 });
	}

	return NextResponse.json({ success: true });
}
