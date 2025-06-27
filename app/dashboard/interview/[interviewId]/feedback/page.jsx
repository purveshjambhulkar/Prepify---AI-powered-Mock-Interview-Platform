"use client";
import { db } from "@/utils/db";
import { answersOfUser } from "@/utils/schema";
import { eq } from "drizzle-orm";
import { useEffect, useState } from "react";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

function Feedback({ params }) {
    const router = useRouter();
	const [feedbackList, setFeedbackList] = useState([]);
	const [averageRating, setAverageRating] = useState(0);

	useEffect(() => {
		GetFeedback();
	}, []);

	const GetFeedback = async () => {
		const result = await db
			.select()
			.from(answersOfUser)
			.where(eq(answersOfUser.mockIdRef, params.interviewId))
			.orderBy(answersOfUser.id);

		// console.log(result);
		setFeedbackList(result);

		// Calculate the average rating
		const ratings = result.map(item => parseFloat(item.rating)).filter(rating => !isNaN(rating));
		const total = ratings.reduce((acc, rating) => acc + rating, 0);
		const average = ratings.length ? total / 5 : 0;

		setAverageRating(average);
	};

	return (
		<div className="p-10">
			<h2 className="text-3xl font-bold text-green-500">Congratulations!</h2>
			<h2 className="font-bold text-2xl">Here is your Interview Feedback</h2>
			<h2 className="text-lg my-3 text-blue-600">
				Your Overall Rating : <strong>{Math.round(averageRating * 10) / 10}/5</strong>
			</h2>

			<h2>
				Find below interview question with correct answer, your answer with
				feedback for improvement
			</h2>
			{feedbackList &&
				feedbackList.map((item, index) => (
					<Collapsible key={index} className="mt-7">
						<CollapsibleTrigger className="p-2 bg-secondary rounded-lg my-2 text-left flex justify-between gap-10 w-full">
							{item.question} <ChevronsUpDown className="h-5 w-5"/>
						</CollapsibleTrigger>
						<CollapsibleContent>
						<div className="flex flex-col gap-2">
                            <h2 className="text-red p-2 border rounded-lg"><strong>Rating: </strong>{item.rating}</h2>
                            <h2 className="p-2 border rounded-lg bg-red-50 text-sm text-red-900"><strong>Your Answer: </strong>{item.userAns}</h2>
                            <h2 className="p-2 border rounded-lg bg-green-50 text-sm text-green-900"><strong>Correct Answer: </strong>{item.correctAns}</h2>
                            <h2 className="p-2 border rounded-lg bg-blue-50 text-sm text-blue-900"><strong>Feedback: </strong>{item.feedback}</h2>
                        </div>
						</CollapsibleContent>
					</Collapsible>
				))}
                
                <Button onClick={() => router.replace('/dashboard')} className="mt-3">Go Home</Button>
		</div>
	);
}

export default Feedback;
