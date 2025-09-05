"use client";

import { useAppSelector } from "@/app/redux/hooks";
import SingleQuestionAndAnswerDisplay from "./SurveyCompleteUtils/SingleQuestionAndAnswerDisplay";
import { useMemo, useState, useEffect } from "react";

const SurveyCompletePage = () => {
	const completedSurvey = useAppSelector((state) => state.survey.value);
	const [isVisible, setIsVisible] = useState(false);

	useEffect(() => {
		const timer = setTimeout(() => setIsVisible(true), 200);
		return () => clearTimeout(timer);
	}, []);

	// Sort questions by question_order and create ordered list
	const orderedQuestions = useMemo(() => {
		if (!completedSurvey?.survey_question) return [];
		return [...completedSurvey.survey_question].sort(
			(a, b) => a.question_order - b.question_order
		);
	}, [completedSurvey]);

	// Count answered questions
	const answeredCount = useMemo(() => {
		return orderedQuestions.filter(
			(question) => question.answer && question.answer.answer_text
		).length;
	}, [orderedQuestions]);

	if (!completedSurvey) {
		return (
			<div className="flex items-center justify-center w-full h-screen bg-background-base">
				<div className="flex flex-col items-center gap-4">
					<div className="w-8 h-8 border-4 rounded-full border-primary/30 border-t-primary animate-spin"></div>
					<p className="text-lg text-foreground">Loading survey results...</p>
				</div>
			</div>
		);
	}

	const completionPercentage = (answeredCount / orderedQuestions.length) * 100;

	return (
		<div className="min-h-screen p-4 bg-gradient-to-br from-background-base via-background-base to-background-header">
			<div className="flex flex-col items-center justify-start w-full max-w-4xl py-8 mx-auto">
				{/* Header Section */}
				<div
					className={`
					mb-12 text-center transition-all duration-1000 ease-out
					${isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-8"}
				`}
				>
					{/* Success Icon */}
					<div className="flex justify-center mb-6">
						<div className="flex items-center justify-center w-20 h-20 border rounded-full bg-gradient-to-br from-accent/20 to-accent/10 border-accent/30 animate-pulse">
							<span className="text-3xl">✨</span>
						</div>
					</div>

					<h1 className="mb-4 text-5xl font-bold text-foreground bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">
						Survey Complete
					</h1>
					<p className="mb-6 text-xl text-neutral-text">
						Thank you for completing the survey! 🎉
					</p>

					<div className="space-y-4 text-center">
						<h2 className="mb-3 text-3xl font-semibold text-primary">
							{completedSurvey.title}
						</h2>
						{completedSurvey.description && (
							<p className="max-w-2xl mx-auto mb-6 text-lg leading-relaxed text-neutral-text">
								{completedSurvey.description}
							</p>
						)}

						{/* Completion Stats */}
						<div className="inline-flex items-center gap-4 px-6 py-4 transition-all duration-300 border shadow-lg rounded-2xl bg-gradient-to-r from-background-elevated to-background-highlight border-neutral/20 hover:shadow-xl hover:shadow-accent/10 hover:scale-105">
							<div className="flex items-center gap-2">
								<span className="text-sm font-medium text-neutral-text">
									Completed:
								</span>
								<span className="text-lg font-bold text-accent">
									{answeredCount} of {orderedQuestions.length} questions
								</span>
							</div>
							<div className="w-px h-6 bg-neutral/30"></div>
							<div className="flex items-center gap-2">
								<span className="text-sm font-medium text-neutral-text">
									Progress:
								</span>
								<span className="text-lg font-bold text-primary">
									{Math.round(completionPercentage)}%
								</span>
							</div>
						</div>

						{/* Progress Bar */}
						<div className="w-full max-w-md mx-auto mt-4">
							<div className="h-3 overflow-hidden border rounded-full bg-background-elevated border-neutral/20">
								<div
									className="h-full transition-all duration-1000 ease-out rounded-full bg-gradient-to-r from-accent to-primary"
									style={{ width: `${completionPercentage}%` }}
								></div>
							</div>
						</div>
					</div>
				</div>

				{/* Questions and Answers */}
				<div className="w-full space-y-8">
					{orderedQuestions.map((question, index) => (
						<SingleQuestionAndAnswerDisplay
							key={question.id || index}
							question={question}
							questionNumber={index + 1}
						/>
					))}
				</div>

				{/* Footer */}
				<div
					className={`
					mt-16 text-center transition-all duration-1000 ease-out delay-500
					${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}
				`}
				>
					<div className="inline-flex items-center gap-3 px-6 py-3 border rounded-xl bg-gradient-to-r from-background-elevated/50 to-background-highlight/50 border-neutral/10 backdrop-blur-sm">
						<span className="text-lg">🙏</span>
						<p className="text-neutral-text">
							You can close this window or navigate back to continue.
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default SurveyCompletePage;
