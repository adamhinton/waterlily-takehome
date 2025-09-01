// For simplicity, this is just a very simple GET endpoint.
// It gets the survey (and survey questions) for the specified ID.
// There will ust be one survey ID in the database with id 1.

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/client";
import { Survey } from "@/app/utils/types/SurveyTypes";

// will be called like api/survey?id=1
export async function GET(
	request: Request
): Promise<NextResponse<Survey> | NextResponse<{ error: string }>> {
	const supabase = createClient();
	const { searchParams } = new URL(request.url);
	const id = searchParams.get("id");

	if (!id) {
		return NextResponse.json({ error: "No id provided" }, { status: 400 });
	}

	const { data, error } = await supabase
		.from("survey")
		.select(
			`
            id,
            title,
            description,
            survey_question (
                id,
                survey_id,
                title,
                question_text,
                question_type,
                is_required,
                min,
                max,
                question_order
            )
        `
		)
		.eq("id", id)
		.single();

	if (error) {
		return NextResponse.json({ error: error.message }, { status: 500 });
	}

	// TODO stretch validate this
	return NextResponse.json(data as unknown as Survey);
}

// -- This is the main survey table
// -- Note that a survey's actual questions are stored in the survey_question table
// -- Each survey has multiple questions1

// DROP TABLE IF EXISTS survey;
// CREATE TABLE IF NOT EXISTS survey (
//     id SERIAL PRIMARY KEY,
//     title VARCHAR(255) NOT NULL,
//     description TEXT
// );

// DROP TABLE IF EXISTS survey_question;
// CREATE TABLE IF NOT EXISTS survey_question (
//     id SERIAL PRIMARY KEY,
//     survey_id INTEGER NOT NULL REFERENCES survey(id) ON DELETE CASCADE,
//     title VARCHAR(255) NOT NULL,
//     question_text TEXT NOT NULL,
//     question_type VARCHAR(10) CHECK (question_type IN ('short_text', 'phone', 'email', 'date', 'number', 'long_text')) NOT NULL,
//     min INTEGER, -- min value for numeric, min length for text
//     max INTEGER, -- max value for numeric, max length for text
//     question_order INTEGER NOT NULL, -- order of the question in the survey
//     is_required BOOLEAN DEFAULT FALSE
// );
