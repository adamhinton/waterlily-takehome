// This is the single source of truth for survey state
// All survey questions and answers are stored here
// I may regret putting it all in one place but it's technical debt.

import { Survey, SurveyAnswer } from "@/app/utils/types/SurveyTypes";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type SurveyState = {
	value?: Survey;
};

const initialState: SurveyState = {
	value: undefined,
};

const surveySlice = createSlice({
	name: "survey",
	initialState,
	// setSurvey, setSingleSurveyAnswer, setMultipleSurveyAnswers, clearSurvey
	reducers: {
		setSurvey: (state, action: PayloadAction<Survey | undefined>) => {
			state.value = action.payload;
		},
		setSingleSurveyAnswer: (state, action: PayloadAction<SurveyAnswer>) => {
			if (!state.value || !state.value.survey_questions) return;
			const { survey_question_id } = action.payload;
			const questionIndex = state.value.survey_questions.findIndex(
				(q) => q.id === survey_question_id
			);
			if (questionIndex === -1) return;
			state.value.survey_questions[questionIndex].answer = action.payload;
		},
		setMultipleSurveyAnswers: (
			state,
			action: PayloadAction<SurveyAnswer[]>
		) => {
			if (!state.value || !state.value.survey_questions) return;
			action.payload.forEach((answer) => {
				const { survey_question_id } = answer;
				const questionIndex = state.value!.survey_questions!.findIndex(
					(q) => q.id === survey_question_id
				);
				if (questionIndex === -1) return;
				state.value!.survey_questions![questionIndex].answer = answer;
			});
		},
		clearSurvey: (state) => {
			state.value = undefined;
		},
	},
});

export const {
	setSurvey,
	setSingleSurveyAnswer,
	setMultipleSurveyAnswers,
	clearSurvey,
} = surveySlice.actions;

export default surveySlice.reducer;
