import { z } from "zod";

const SurveyAnswerSchema = z.object({
	id: z.number().int().positive(),
	survey_question_id: z.number().int().positive(),
	answer_text: z.string().min(1).max(1000),
});
export type SurveyAnswer = z.infer<typeof SurveyAnswerSchema>;

export const SurveyQuestionSchema = z.object({
	id: z.number().int().positive(),
	survey_id: z.number().int().positive(),
	title: z.string().min(1).max(255),
	question_text: z.string().min(1),
	// question_type IN ('short_text', 'phone', 'email', 'date', 'number', 'long_text'))
	question_type: z.enum([
		"short_text",
		"phone",
		"email",
		"date",
		"number",
		"long_text",
	]),
	is_required: z.boolean().default(false),
	min: z.number().int().optional().nullable(),
	max: z.number().int().optional().nullable(),
	question_order: z.number().int().positive(),
	answer: SurveyAnswerSchema.optional().nullable(),
});
export type SurveyQuestion = z.infer<typeof SurveyQuestionSchema>;

export const SurveySchema = z.object({
	id: z.number().int().positive(),
	title: z.string().min(1).max(255),
	description: z.string().max(1000).optional().nullable(),
	survey_questions: z.array(SurveyQuestionSchema).optional().nullable(),
});
export type Survey = z.infer<typeof SurveySchema>;
