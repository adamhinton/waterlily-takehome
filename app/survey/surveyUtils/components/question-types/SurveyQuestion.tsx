import { FieldValues, UseFormReturn } from "react-hook-form";
import LongText from "./LongText";
import Email from "./Email";
import Date from "./Date";
import Number from "./Number";
import Phone from "./Phone";
import ShortText from "./ShortText";
import { SurveyQuestion as SurveyQuestionType } from "@/app/utils/types/SurveyTypes";

interface SurveyQuestionProps {
	question: SurveyQuestionType;
	form: UseFormReturn<FieldValues>;
}

export default function SurveyQuestion({
	question,
	form,
}: SurveyQuestionProps) {
	const {
		register,
		formState: { errors },
	} = form;

	const renderQuestion = () => {
		switch (question.question_type) {
			case "short_text":
				return (
					<ShortText question={question} register={register} errors={errors} />
				);
			case "long_text":
				return (
					<LongText question={question} register={register} errors={errors} />
				);
			case "email":
				return (
					<Email question={question} register={register} errors={errors} />
				);
			case "date":
				return <Date question={question} register={register} errors={errors} />;
			case "number":
				return (
					<Number question={question} register={register} errors={errors} />
				);
			case "phone":
				return (
					<Phone question={question} register={register} errors={errors} />
				);

			default:
				return <p>Unsupported question type</p>;
		}
	};

	return (
		<div className="w-full max-w-lg rounded-lg bg-background-elevated p-8 shadow-lg">
			<h2 className="mb-4 text-2xl font-bold text-foreground">
				{question.title}
			</h2>
			{renderQuestion()}
		</div>
	);
}
