import { useState, useEffect } from "react";
import { SurveyQuestion } from "@/app/utils/types/SurveyTypes";

type Props = {
	question: SurveyQuestion;
	questionNumber: number;
};

const SingleQuestionAndAnswerDisplay = (props: Props) => {
	const { question, questionNumber } = props;
	const [isVisible, setIsVisible] = useState(false);

	useEffect(() => {
		const timer = setTimeout(() => setIsVisible(true), questionNumber * 100);
		return () => clearTimeout(timer);
	}, [questionNumber]);

	const hasAnswer = question.answer && question.answer.answer_text;
	const isLongAnswer = question.question_type === "long_text";

	const formatQuestionType = (type: string): string => {
		switch (type) {
			case "short_text":
				return "Text";
			case "long_text":
				return "Long Text";
			case "email":
				return "Email";
			case "phone":
				return "Phone";
			case "date":
				return "Date";
			case "number":
				return "Number";
			default:
				return "Text";
		}
	};

	const getTypeIcon = (type: string): string => {
		switch (type) {
			case "email":
				return "✉️";
			case "phone":
				return "📱";
			case "date":
				return "📅";
			case "number":
				return "🔢";
			case "long_text":
				return "📝";
			default:
				return "💬";
		}
	};

	return (
		<div
			className={`
				w-full max-w-2xl rounded-xl bg-background-elevated p-6 
				shadow-lg border border-neutral/20 
				transition-all duration-700 ease-out
				hover:shadow-xl hover:shadow-primary/5 hover:border-primary/30
				group
				${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}
			`}
		>
			{/* Question Header */}
			<div className="flex items-start justify-between mb-6">
				<div className="flex-1">
					<div className="flex items-center gap-3 mb-3">
						<span className="flex items-center justify-center w-10 h-10 text-sm font-bold transition-all duration-300 border rounded-full bg-gradient-to-br from-primary/20 to-primary/10 text-primary border-primary/20 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-primary/20">
							{questionNumber}
						</span>
						<div className="flex items-center gap-2">
							<span className="text-lg">
								{getTypeIcon(question.question_type)}
							</span>
							<span
								className="
								text-sm font-medium text-neutral-text 
								bg-background-highlight px-3 py-1.5 rounded-lg
								border border-neutral/10
								transition-colors duration-300
								group-hover:bg-background-highlight group-hover:text-foreground
							"
							>
								{formatQuestionType(question.question_type)}
							</span>
							{question.is_required && (
								<span
									className="
									text-xs font-medium text-secondary 
									bg-gradient-to-r from-secondary/20 to-secondary/10 
									px-3 py-1.5 rounded-lg border border-secondary/20
									transition-all duration-300
									group-hover:scale-105
								"
								>
									Required
								</span>
							)}
						</div>
					</div>
					<h3 className="mb-2 text-xl font-semibold transition-colors duration-300 text-foreground group-hover:text-primary">
						{question.title}
					</h3>
					<p className="leading-relaxed text-neutral-text">
						{question.question_text}
					</p>
				</div>
			</div>

			{/* Answer Display */}
			<div className="pt-6 mt-6 border-t border-neutral/20">
				{hasAnswer ? (
					<div className="space-y-3">
						<div className="flex items-center gap-2">
							<span className="text-lg">💭</span>
							<p className="text-sm font-medium text-accent">Answer:</p>
						</div>
						<div
							className={`
								rounded-lg bg-gradient-to-br from-background-highlight to-background-elevated 
								p-4 border border-neutral/10
								transition-all duration-300
								hover:border-accent/30 hover:shadow-md hover:shadow-accent/5
								${isLongAnswer ? "min-h-[120px]" : ""}
							`}
						>
							<p
								className={`
									text-foreground transition-colors duration-300
									${isLongAnswer ? "whitespace-pre-wrap leading-relaxed text-sm" : "font-medium"}
								`}
							>
								{question.answer!.answer_text}
							</p>
						</div>
					</div>
				) : (
					<div className="flex items-center gap-3 p-4 transition-all duration-300 border border-dashed rounded-lg bg-gradient-to-r from-neutral/5 to-neutral/10 border-neutral/30 hover:border-neutral/50">
						<div className="w-3 h-3 rounded-full bg-neutral/40 animate-pulse"></div>
						<p className="italic text-neutral-text">No answer provided</p>
					</div>
				)}
			</div>
		</div>
	);
};

export default SingleQuestionAndAnswerDisplay;
