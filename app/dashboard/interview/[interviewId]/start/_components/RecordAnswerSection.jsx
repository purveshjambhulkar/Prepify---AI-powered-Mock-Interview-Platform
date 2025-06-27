"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import web from "./webcam.png";
import Webcam from "react-webcam";
import { Button } from "@/components/ui/button";
import useSpeechToText from "react-hook-speech-to-text";
import { StopCircle } from "lucide-react";
import { toast } from "sonner";
import { chatSession } from "@/utils/GeminiAIModel";
import { db } from "@/utils/db";
import { useUser } from "@clerk/nextjs";
import moment from "moment";
import { answersOfUser } from "@/utils/schema";

function RecordAnswerSection({
	mockInterviewQuestion,
	activeQuestionIndex,
	interviewData,
}) {
	const [userAnswer, setUserAnswer] = useState("");
	const { user } = useUser();
	const [loading, setLoading] = useState(false);

	const {
		error,
		interimResult,
		isRecording,
		results,
		setResults,
		startSpeechToText,
		stopSpeechToText,
	} = useSpeechToText({
		continuous: true,
		useLegacyResults: false,
	});

	useEffect(() => {
		if (results.length > 0) {
			const latestResult = results[results.length - 1]?.transcript;
			setUserAnswer((prevAns) => prevAns + " " + latestResult);
		}
	}, [results]);

	useEffect(() => {
		if (!isRecording && userAnswer.length > 10) {
			UpdateUserAnswerInDB();
		}
	}, [isRecording, userAnswer]);

	const StartStopRecording = async () => {
		if (isRecording) {
			stopSpeechToText();
		} else {
			startSpeechToText();
		}
	};

	const UpdateUserAnswerInDB = async () => {
		setLoading(true);

		const feedbackPrompt =
			`Question: ${mockInterviewQuestion[activeQuestionIndex]?.Question},` +
			`User Answer: ${userAnswer},` +
			`Depends on Question and user answer for given interview question` +
			`please give us rating (you must not be so strict while rating ) for answer and feedback as area of improvement if any in just 3 to 5 lines to improve it in JSON format with rating field and feedback field`;

		try {
			const result = await chatSession.sendMessage(feedbackPrompt);
			let MockJSONResp = await result.response.text();

			// console.log("Raw Response:", MockJSONResp);

			MockJSONResp = MockJSONResp.replace("```json", "")
				.replace("```", "")
				.trim();

			const jsonEnd = MockJSONResp.lastIndexOf("}") + 1;
			const validJson = MockJSONResp.substring(0, jsonEnd);

			let parsedResponse;
			try {
				parsedResponse = JSON.parse(validJson);
				// console.log("Parsed JSON:", parsedResponse);
			} catch (parseError) {
				console.error("Failed to parse JSON:", parseError);
				toast.error("Failed to parse feedback JSON.");
				return;
			}

			// console.log("mockIdRef", interviewData.mockId);

			const resp = await db
				.insert(answersOfUser)
				.values({
					mockIdRef: interviewData.mockId, 
					question: mockInterviewQuestion[activeQuestionIndex]?.Question,
					correctAns: mockInterviewQuestion[activeQuestionIndex]?.Answer,
					userAns: userAnswer,
					feedback: parsedResponse?.feedback,
					rating: parsedResponse?.rating,
					userEmail: user.primaryEmailAddress?.emailAddress,
					createdAt: moment().format("DD-MM-YYYY"),
				})
				.returning({ id: answersOfUser.mockIdRef });

			// console.log("Insert Response:", resp);

			if (resp) {
				toast.success("Answer saved successfully");
				setUserAnswer("");
				setResults([]);
			}
		} catch (error) {
			console.error("Failed to process response:", error);
			toast.error("An error occurred while generating feedback.");
		} finally {
			setUserAnswer("");
			setResults([]);
			setLoading(false);
		}
	};

	const [isWebcamActive, setIsWebcamActive] = useState(false);
	const [hasWebcamError, setHasWebcamError] = useState(false);

	useEffect(() => {
		const timer = setTimeout(() => {
			setIsWebcamActive(true);
		}, 1000);

		return () => clearTimeout(timer);
	}, []);

	const handleUserMediaError = () => {
		setHasWebcamError(true);
		setIsWebcamActive(false);
	};

	if (error) return <p>Web Speech API is not available in this browser 🤷‍</p>;

	return (
		<div className="flex items-center justify-center flex-col">
			<div className="flex flex-col mt-14 justify-center items-center bg-gray-700 rounded-lg p-5">
				{isWebcamActive && !hasWebcamError ? (
					<Webcam
						mirrored={true}
						onUserMediaError={handleUserMediaError}
						className="text-white h-92 w-full z-10"
					/>
				) : (
					<Image
						src={web}
						width={400}
						height={400}
						alt="Camera"
						className="cursor-pointer"
					/>
				)}
			</div>
			<Button
				disabled={loading}
				variant="outline"
				className="my-10"
				onClick={StartStopRecording}
			>
				{isRecording ? (
					<h2 className="text-red-700 flex gap-2">
						<StopCircle className="mr-2" />
						Stop Recording...
					</h2>
				) : (
					"Record Answer"
				)}
			</Button>

			{/* Display the transcribed text below the camera in real-time */}
			{userAnswer && (
				<div className="mt-5 p-4 bg-gray-100 rounded-lg w-full max-w-lg">
					<h2 className="text-md font-semibold">Your Answer:</h2>
					<p className="text-sm text-gray-700 mt-2">{userAnswer}</p>
				</div>
			)}
			{/* Display interim results */}
			{interimResult && (
				<div className="mt-2 p-2 bg-yellow-100 rounded-lg w-full max-w-lg">
					<p className="text-sm text-gray-800">{interimResult}</p>
				</div>
			)}
		</div>
	);
}

export default RecordAnswerSection;
