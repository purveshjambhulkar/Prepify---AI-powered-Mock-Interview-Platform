'use client'
import { db } from "@/utils/db";
import { MockInterview } from "@/utils/schema";
import { eq } from "drizzle-orm";
import { useState, useEffect } from "react";
import QuestionsSection from "./_components/QuestionsSection";
import RecordAnswerSection from "./_components/RecordAnswerSection";
import { Button } from "@/components/ui/button";
import Link from "next/link";

function StartInterview({ params }) {
  const [interviewData, setInterviewData] = useState(null);
  const [mockInterviewQuestion, setMockInterviewQuestion] = useState(null);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);

  useEffect(() => {
    GetInterviewDetails();
  }, []);

  const GetInterviewDetails = async () => {
    try {
      const result = await db
        .select()
        .from(MockInterview)
        .where(eq(MockInterview.mockId, params.interviewId)); // params.interviewId should be a valid UUID string

      if (result.length > 0) {
        const jsonMockResp = JSON.parse(result[0].jsonMockResp);
        // console.log(jsonMockResp);

        setMockInterviewQuestion(jsonMockResp);
        setInterviewData(result[0]);
      } else {
        console.log("No interview found with the provided ID.");
      }
    } catch (error) {
      console.error("Error fetching interview details:", error);
    }
  };

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
      <div className="w-full max-w-lg">
        <QuestionsSection
          mockInterviewQuestion={mockInterviewQuestion}
          activeQuestionIndex={activeQuestionIndex}
          setActiveQuestionIndex={setActiveQuestionIndex} // Pass the state setter function
        />
      </div>
      <div className="w-full max-w-lg">
        <RecordAnswerSection
          mockInterviewQuestion={mockInterviewQuestion}
          activeQuestionIndex={activeQuestionIndex}
          interviewData={interviewData}
        />
      </div>
      <div className="flex justify-end gap-6 items-end w-max">
        {activeQuestionIndex > 0 && (
          <Button onClick={() => setActiveQuestionIndex(activeQuestionIndex - 1)}>
            Prev Question
          </Button>
        )}
        {activeQuestionIndex < (mockInterviewQuestion?.length - 1) && (
          <Button onClick={() => setActiveQuestionIndex(activeQuestionIndex + 1)}>
            Next Question
          </Button>
        )}
        {activeQuestionIndex <= (mockInterviewQuestion?.length - 1) && (
          <Link href={'/dashboard/interview/'+interviewData?.mockId+'/feedback'}>
            <Button>End Interview</Button>
          </Link>
        )}
      </div>
    </div>
  );
}

export default StartInterview;
