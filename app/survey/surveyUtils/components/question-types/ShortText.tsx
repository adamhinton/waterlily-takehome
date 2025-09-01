import { SurveyQuestion } from "@/utils/supabase/server.ts/types/SurveyType";
import { UseFormRegister, FieldErrors, FieldValues } from "react-hook-form";

interface ShortTextProps {
	question: SurveyQuestion;
	register: UseFormRegister<FieldValues>;
	errors: FieldErrors<FieldValues>;
}

export default function ShortText({
	question,
	register,
	errors,
}: ShortTextProps) {
	return (
		<div>
			<label
				htmlFor={question.id!.toString()}
				className="block text-lg font-medium text-neutral-text"
			>
				{question.question_text}
			</label>
			<input
				type="text"
				id={question.id!.toString()}
				{...register(question.id!.toString(), {
					required: question.is_required,
					minLength: question.min ?? undefined,
					maxLength: question.max ?? undefined,
				})}
				className="mt-1 block w-full rounded-md border-gray-300 bg-background-elevated p-2 shadow-sm focus:border-primary focus:ring-primary"
			/>
			{errors[question.id!.toString()] && (
				<p className="mt-2 text-sm text-red-600">
					{errors[question.id!.toString()]?.message as string}
				</p>
			)}
		</div>
	);
}
