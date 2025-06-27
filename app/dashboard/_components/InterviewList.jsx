"use client";
import { db } from "@/utils/db";
import { MockInterview } from "@/utils/schema";
import { useUser } from "@clerk/nextjs";
import { desc, eq } from "drizzle-orm";
import { useEffect, useState } from "react";
import InterviewItemCard from "./InterviewItemCard";
// import Loading from "@/app/loading";
import Loading2 from "./loading2";

function InterviewList() {
	const { user } = useUser();
	const [interviewList, setInterviewList] = useState([]);

	useEffect(() => {
		if (user) {
			GetInterviewList();
		}
	}, [user]);

	const GetInterviewList = async () => {
		try {
			const result = await db
				.select()
				.from(MockInterview)
				.where(
					eq(MockInterview.createdBy, user?.primaryEmailAddress.emailAddress)
				)
				.orderBy(desc(MockInterview.id));

			// console.log(result);
			setInterviewList(result);
		} catch (error) {
			console.error("Error fetching interview list:", error);
		}
	};
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		// Show loading for 3 seconds
		const timer = setTimeout(() => {
			setLoading(false);
		}, 3000);

		return () => clearTimeout(timer);
	}, []);

	if (loading) {
		return <Loading2 />; // Import the loading component from loading.js if needed
	}

	return (
		<div className="p-5 gap-3">
			<h2 className="font-medium text-xl mb-4">Previous Mock Interviews</h2>
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 ">
				{interviewList.length > 0 ? (
					interviewList.map((interview, index) => (
						<InterviewItemCard key={interview.id} interview={interview} />
					))
				) : (
					<p>No interviews found.</p>
				)}
			</div>
		</div>
	);
}

export default InterviewList;
