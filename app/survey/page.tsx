"use client";
import { useEffect, useState, useCallback } from "react";
import { useAppSelector, useAppDispatch } from "@/app/redux/hooks";
import {
	setSurvey,
	setSingleSurveyAnswer,
} from "@/app/redux/reducers/surveyReducer";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { RootState } from "../redux/store";
import { redirect } from "next/navigation";
import {
	Survey,
	SurveyAnswer,
	SurveyQuestion as SurveyQuestionType,
} from "../utils/types/SurveyTypes";
import SurveyQuestion from "./surveyUtils/components/question-types/SurveyQuestion";

export default function SurveyPage() {
	const dispatch = useAppDispatch();
	const survey = useAppSelector((state: RootState) => state.survey.value);
	const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
	const [orderedQuestions, setOrderedQuestions] = useState<
		SurveyQuestionType[]
	>([]);

	useEffect(() => {
		// Fetch survey data and set it in the Redux store
		const fetchSurvey = async () => {
			const response = await fetch("/api/survey?id=1");
			const surveyData: Survey = await response.json();
			dispatch(setSurvey(surveyData));
		};
		fetchSurvey();
	}, [dispatch]);

	useEffect(() => {
		console.log("survey_questions in useEffect:", survey?.survey_question);
		if (survey?.survey_question) {
			const sortedQuestions = [...survey.survey_question].sort(
				(a, b) => a.question_order - b.question_order
			);
			console.log("sortedQuestions:", sortedQuestions);
			setOrderedQuestions(sortedQuestions);
		}
	}, [survey]);

	const currentQuestion = orderedQuestions[currentQuestionIndex];

	const getValidationSchema = (question: SurveyQuestionType) => {
		if (!question) return z.object({}).passthrough();
		let schema: z.ZodTypeAny;
		switch (question.question_type) {
			case "email":
				schema = z.string().email({ message: "Invalid email address" });
				break;
			case "number":
				let numSchema = z.coerce.number();
				if (question.min != null) {
					numSchema = numSchema.min(question.min, {
						message: `Must be at least ${question.min}`,
					});
				}
				if (question.max != null) {
					numSchema = numSchema.max(question.max, {
						message: `Must be at most ${question.max}`,
					});
				}
				schema = numSchema;
				break;
			default:
				let strSchema = z.string();
				if (question.min != null) {
					strSchema = strSchema.min(question.min, {
						message: `Must be at least ${question.min} characters`,
					});
				}
				if (question.max != null) {
					strSchema = strSchema.max(question.max, {
						message: `Must be at most ${question.max} characters`,
					});
				}
				schema = strSchema;
		}

		if (question.is_required) {
			if (schema instanceof z.ZodString) {
				schema = schema.min(1, { message: "This field is required" });
			}
		} else {
			schema = schema.optional().nullable();
		}

		return z.object({
			[question.id!.toString()]: schema,
		});
	};

	const form = useForm({
		resolver: zodResolver(getValidationSchema(currentQuestion)),
		defaultValues: currentQuestion?.answer
			? {
					[currentQuestion.id!.toString()]:
						currentQuestion.answer.answer_text ?? "",
			  }
			: {},
	});

	const onSubmit = useCallback(async () => {
		// Validate the last question
		const isValid = await form.trigger();
		if (!isValid) {
			return;
		}

		const value = form.getValues(currentQuestion.id!.toString());
		const lastAnswer: SurveyAnswer = {
			survey_question_id: currentQuestion.id!,
			answer_text: String(value),
		};
		dispatch(setSingleSurveyAnswer(lastAnswer));

		if (!survey?.survey_question) {
			console.error("No questions to submit");
			return;
		}

		// Wait a moment for Redux to update, then get fresh state
		await new Promise((resolve) => setTimeout(resolve, 100));

		// Collect all answers, making sure to include the last one we just dispatched
		const allAnswers = orderedQuestions
			.map((q) => {
				if (q.id === currentQuestion.id) {
					return lastAnswer; // Include the last answer explicitly since Redux might not have updated yet
				}
				return survey.survey_question?.find((sq) => sq.id === q.id)?.answer;
			})
			.filter((a): a is SurveyAnswer => a != null);

		console.log("All answers being submitted:", allAnswers);
		console.log("Number of answers:", allAnswers.length);
		console.log("Number of questions:", orderedQuestions.length);

		if (!allAnswers || allAnswers.length === 0) {
			console.error("No answers to submit");
			return;
		}

		let success = false;
		try {
			const response = await fetch("/api/survey/survey_answers", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(allAnswers),
			});

			if (!response.ok) {
				throw new Error("Failed to submit survey answers");
			}

			const result = await response.json();
			if (result.success) {
				success = true;
				alert("Survey submitted successfully!");
			} else {
				throw new Error(result.error || "An unknown error occurred");
			}
		} catch (error) {
			console.error("Error submitting survey:", error);
			alert("There was an error submitting your survey. Please try again.");
		}

		if (success) {
			redirect("/survey/complete");
		}
	}, [form, currentQuestion, dispatch, survey, orderedQuestions]);

	useEffect(() => {
		form.reset(
			currentQuestion?.answer
				? {
						[currentQuestion.id!.toString()]:
							currentQuestion.answer.answer_text ?? "",
				  }
				: {}
		);
	}, [currentQuestion, form]);

	const handleNext = useCallback(async () => {
		const isValid = await form.trigger();
		if (isValid) {
			const value = form.getValues(currentQuestion.id!.toString());
			const answer: SurveyAnswer = {
				survey_question_id: currentQuestion.id!,
				answer_text: String(value),
			};
			dispatch(setSingleSurveyAnswer(answer));
			if (currentQuestionIndex < orderedQuestions.length - 1) {
				setCurrentQuestionIndex(currentQuestionIndex + 1);
			}
		}
	}, [
		form,
		currentQuestion,
		dispatch,
		currentQuestionIndex,
		orderedQuestions.length,
	]);

	const handlePrevious = useCallback(() => {
		if (currentQuestionIndex > 0) {
			setCurrentQuestionIndex(currentQuestionIndex - 1);
		}
	}, [currentQuestionIndex]);

	// Keyboard shortcuts
	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			const activeElement = document.activeElement;
			const isInputFocused =
				activeElement &&
				(activeElement.tagName === "INPUT" ||
					activeElement.tagName === "TEXTAREA" ||
					activeElement.getAttribute("contenteditable") === "true");

			const isLastQuestion =
				currentQuestionIndex === orderedQuestions.length - 1;

			switch (event.key) {
				case "Enter":
					// For textareas, only trigger navigation with Ctrl+Enter to allow normal line breaks
					if (
						isInputFocused &&
						activeElement.tagName === "TEXTAREA" &&
						!event.ctrlKey
					) {
						return; // Allow normal Enter behavior in textarea
					}

					// For all other cases (regular inputs or Ctrl+Enter in textarea), trigger navigation
					event.preventDefault();
					if (isLastQuestion) {
						onSubmit();
					} else {
						handleNext();
					}
					break;
				case "ArrowLeft":
					// Only prevent arrow keys when NOT in input fields to avoid interfering with text navigation
					if (!isInputFocused) {
						event.preventDefault();
						handlePrevious();
					}
					break;
				case "ArrowRight":
					// Only prevent arrow keys when NOT in input fields to avoid interfering with text navigation
					if (!isInputFocused) {
						event.preventDefault();
						if (isLastQuestion) {
							onSubmit();
						} else {
							handleNext();
						}
					}
					break;
			}
		};

		document.addEventListener("keydown", handleKeyDown);
		return () => {
			document.removeEventListener("keydown", handleKeyDown);
		};
	}, [
		currentQuestionIndex,
		orderedQuestions.length,
		handleNext,
		handlePrevious,
		onSubmit,
	]);

	if (!survey || !currentQuestion) {
		return (
			<div className="flex items-center justify-center w-full h-screen bg-gradient-to-br from-background-base via-background-base to-background-header">
				<div className="flex flex-col items-center gap-4">
					<div className="w-12 h-12 border-4 rounded-full border-primary/30 border-t-primary animate-spin"></div>
					<p className="text-xl text-foreground animate-pulse">
						Loading survey...
					</p>
				</div>
			</div>
		);
	}

	const isLastQuestion = currentQuestionIndex === orderedQuestions.length - 1;

	return (
		<div className="flex flex-col items-center justify-center w-full h-screen p-4 bg-gradient-to-br from-background-base via-background-base to-background-header">
			{/* Animated Background Elements */}
			<div className="absolute inset-0 overflow-hidden pointer-events-none">
				<div className="absolute w-64 h-64 rounded-full top-1/4 left-1/4 bg-primary/5 blur-3xl animate-pulse"></div>
				<div className="absolute w-48 h-48 delay-1000 rounded-full bottom-1/4 right-1/4 bg-accent/5 blur-3xl animate-pulse"></div>
			</div>

			<div className="relative z-10 w-full max-w-2xl">
				{/* Header Section */}
				<div className="mb-12 text-center animate-fade-in-up">
					<h1 className="mb-4 text-5xl font-bold text-foreground bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text">
						{survey.title}
					</h1>
					<p className="max-w-xl mx-auto text-xl leading-relaxed text-neutral-text">
						{survey.description}
					</p>
				</div>

				{/* Question Container */}
				<div className="p-8 transition-all duration-500 ease-out transform border shadow-2xl bg-gradient-to-br from-background-elevated to-background-highlight rounded-2xl border-neutral/20 hover:shadow-primary/10 hover:border-primary/30">
					<SurveyQuestion question={currentQuestion} form={form} />
				</div>

				{/* Navigation */}
				<div className="flex items-center justify-between w-full mt-8">
					<button
						onClick={handlePrevious}
						disabled={currentQuestionIndex === 0}
						className="px-6 py-3 font-medium text-white transition-all duration-300 ease-out rounded-xl bg-gradient-to-r from-secondary to-secondary/80 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 hover:shadow-lg hover:shadow-secondary/25 active:scale-95"
					>
						← Previous
					</button>
					{isLastQuestion ? (
						<FinishButton onSubmit={onSubmit} />
					) : (
						<NextButton onNext={handleNext} />
					)}
				</div>

				{/* Keyboard Shortcuts Help */}
				<div className="flex flex-wrap items-center justify-center gap-4 mt-6 text-sm text-neutral-text/70">
					<div className="flex items-center gap-2">
						<kbd className="px-2 py-1 text-xs border rounded bg-background-elevated border-neutral/30">
							Enter
						</kbd>
						<span>{isLastQuestion ? "Submit" : "Next"}</span>
					</div>
					<div className="flex items-center gap-2">
						<kbd className="px-2 py-1 text-xs border rounded bg-background-elevated border-neutral/30">
							Ctrl
						</kbd>
						<span>+</span>
						<kbd className="px-2 py-1 text-xs border rounded bg-background-elevated border-neutral/30">
							Enter
						</kbd>
						<span>in textarea</span>
					</div>
					<div className="flex items-center gap-2">
						<kbd className="px-2 py-1 text-xs border rounded bg-background-elevated border-neutral/30">
							←
						</kbd>
						<span>Previous</span>
					</div>
					<div className="flex items-center gap-2">
						<kbd className="px-2 py-1 text-xs border rounded bg-background-elevated border-neutral/30">
							→
						</kbd>
						<span>{isLastQuestion ? "Submit" : "Next"}</span>
					</div>
				</div>

				{/* Progress Section */}
				<div className="w-full mt-8">
					{/* Progress Bar */}
					<div className="relative h-4 overflow-hidden border rounded-full shadow-inner bg-background-elevated border-neutral/20">
						<div
							className="relative h-full overflow-hidden transition-all duration-700 ease-out rounded-full bg-gradient-to-r from-accent via-primary to-accent"
							style={{
								width: `${
									((currentQuestionIndex + 1) / orderedQuestions.length) * 100
								}%`,
							}}
						>
							{/* Animated shimmer effect */}
							<div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
						</div>
					</div>

					{/* Progress Text */}
					<div className="flex items-center justify-between mt-4">
						<p className="text-sm text-neutral-text">
							Question {currentQuestionIndex + 1} of {orderedQuestions.length}
						</p>
						<p className="text-sm font-medium text-primary">
							{Math.round(
								((currentQuestionIndex + 1) / orderedQuestions.length) * 100
							)}
							% Complete
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}

const NextButton = ({ onNext }: { onNext: () => void }) => {
	return (
		<button
			onClick={onNext}
			className="px-8 py-3 font-medium text-white transition-all duration-300 ease-out rounded-xl bg-gradient-to-r from-primary to-primary/80 hover:scale-105 hover:shadow-lg hover:shadow-primary/25 active:scale-95 focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-
			offset-background-base"
		>
			Next →
		</button>
	);
};

const FinishButton = ({ onSubmit }: { onSubmit: () => void }) => {
	return (
		<button
			onClick={onSubmit}
			className="relative px-8 py-3 overflow-hidden font-medium text-white transition-all duration-300 ease-out rounded-xl bg-gradient-to-r from-accent to-accent/80 hover:scale-105 hover:shadow-lg hover:shadow-accent/25 active:scale-95 focus:ring-2 focus:ring-accent/50 focus:ring-offset-2 focus:ring-offset-background-base"
		>
			<span className="relative z-10">Finish ✨</span>
			<div className="absolute inset-0 transition-transform duration-700 transform translate-x-full -skew-x-12 bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:translate-x-0"></div>
		</button>
	);
};
