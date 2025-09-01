// For simplicity, this is just a very simple GET endpoint.
// It gets the survey (and survey questions) for the specified ID.
// There will ust be one survey ID in the database with id 1.

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/client";
import { Survey } from "@/app/utils/types/SurveyTypes";

export async function GET(request: Request): Promise<NextResponse<Survey>> {}
