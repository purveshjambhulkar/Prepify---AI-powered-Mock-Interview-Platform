"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { LoaderCircle } from "lucide-react";

function InterviewItemCard({ interview }) {
    const [loading, setLoading] = useState(null); // Track which button is loading
    const router = useRouter();

    const onStart = async () => {
        setLoading("start");
        // Simulate async operation
        setTimeout(() => {
            router.push(`/dashboard/interview/${interview?.mockId}`);
        }, 1000); // Adjust time as needed
        // You can remove the setTimeout if the routing is instant
    }

    const onFeedback = async () => {
        setLoading("feedback");
        // Simulate async operation
        setTimeout(() => {
            router.push(`/dashboard/interview/${interview?.mockId}/feedback`);
        }, 1000); // Adjust time as needed
        // You can remove the setTimeout if the routing is instant
    }

    return (
        <div className="border border-gray-200 shadow-md rounded-lg overflow-hidden transition-transform transform hover:scale-105 hover:shadow-lg duration-300">
            {/* Header Section */}
            <div className="bg-blue-50 p-4">
                <h2 className="text-xl font-semibold text-blue-800">{interview?.jobPosition}</h2>
                <p className="text-sm text-gray-600">
                    {interview?.jobExperience} Years of Experience
                </p>
            </div>

            {/* Date Section */}
            <div className="bg-gray-100 p-3 border-t border-gray-200">
                <p className="text-xs text-gray-400">
                    Created At: {interview.createdAt}
                </p>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between p-4 border-t border-gray-200 bg-white">
                <Button
                    variant="outline"
                    className={`flex-1 mr-2 ${loading === "feedback" ? "bg-gray-200 border-gray-400" : "bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200 hover:border-gray-400"} transition-colors duration-300`}
                    onClick={onFeedback}
                    disabled={loading === "feedback"}
                >
                    {loading === "feedback" ? <LoaderCircle className="animate-spin mr-2" /> : null}
                    Feedback
                </Button>
                <Button
                    className={`flex-1 ml-2 ${loading === "start" ? "bg-blue-600" : " text-white hover:bg-blue-600"} transition-colors duration-300`}
                    onClick={onStart}
                    disabled={loading === "start"}
                >
                    {loading === "start" ? <LoaderCircle className="animate-spin mr-2" /> : null}
                    Start
                </Button>
            </div>
        </div>
    );
}

export default InterviewItemCard;
