// ________________
// This is the final page after completing the survey
// It displays a list of the user's completed answers and questions from the survey
// ________________

// skeleton page with just Complete!
export default function CompletePage() {
	return (
		<div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4">
			<h1 className="text-4xl font-bold text-green-600">Complete!</h1>
			<p className="mt-4 text-lg text-gray-700">
				Thank you for completing the survey.
			</p>
		</div>
	);
}
