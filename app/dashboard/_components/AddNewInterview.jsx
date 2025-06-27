"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose, 
} from "@/components/ui/dialog";
import { chatSession } from "@/utils/GeminiAIModel";
import { LoaderCircle } from "lucide-react";
import { db } from "@/utils/db";
import { MockInterview } from "@/utils/schema";
import { useUser } from "@clerk/nextjs";
import moment from "moment/moment";
import { useRouter } from "next/navigation";

function AddNewInterview() {
  const [openDialog, setOpenDialog] = useState(false);
  const [jobPosition, setJobPosition] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [jobExperience, setJobExperience] = useState("");
  const [loading, setLoading] = useState(false);
  const [jsonResponse, setJsonResponse] = useState([]);
  const router = useRouter();
  const { user } = useUser();

  const onSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();

    const InputPrompt =
      "Job Position: " +
      jobPosition +
      ", Job Description: " +
      jobDescription +
      ", Years of Experience: " +
      jobExperience +
      ". Based on this Information, please give me " +
      process.env.NEXT_PUBLIC_INTERVIEW_QUESTION_COUNT +
      " Interview Questions with Answers in JSON Format. Use 'Question' and 'Answer' as fields in JSON.";

    try {
      const result = await chatSession.sendMessage(InputPrompt);
      let MockJSONResp = await result.response.text();

      MockJSONResp = MockJSONResp.replace("```json", "")
        .replace("```", "")
        .trim();

      const jsonEnd = MockJSONResp.lastIndexOf("]") + 1;
      const validJson = MockJSONResp.substring(0, jsonEnd);

      let parsedResponse;
      try {
        parsedResponse = JSON.parse(validJson);
      } catch (parseError) {
        console.error("Failed to parse JSON:", parseError);
        setLoading(false);
        return;
      }

      setJsonResponse(parsedResponse);

      if (parsedResponse) {
        const resp = await db
          .insert(MockInterview)
          .values({
            mockId: uuidv4(),
            jsonMockResp: validJson,
            jobPosition: jobPosition,
            jobDesc: jobDescription,
            jobExperience: jobExperience,
            createdBy: user.primaryEmailAddress?.emailAddress,
            createdAt: moment().format("DD-MM-YYYY"),
          })
          .returning({ mockId: MockInterview.mockId });

        if (resp) {
          setOpenDialog(false);
          router.push(`/dashboard/interview/` + resp[0]?.mockId);
        }
      } else {
        console.log("ERROR: Failed to insert Mock Interview");
      }
    } catch (error) {
      console.error("Failed to process response:", error);
    }

    setLoading(false);
  };

  return (
    <div>
      <div
        className="p-10 border rounded-lg bg-secondary 
            hover:scale-105 hover:shadow-md cursor-pointer transition-all"
        onClick={() => setOpenDialog(true)}
      >
        <h2 className="font-bold text-2xl text-center">+ Add New</h2>
      </div>
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              Tell us more about your Job Interview
            </DialogTitle>
            <DialogClose asChild>
              {/* <Button
                                variant="ghost"
                                onClick={() => setOpenDialog(false)}
                            >
                                &times;
                            </Button> */}
            </DialogClose>
            <DialogDescription>
              <form onSubmit={onSubmit}>
                <div>
                  <h2>
                    Add Details About your Job Position/ Role, Job Description
                    and Years of Experience
                  </h2>
                  <div className="mt-7 my-3 flex flex-col gap-2">
                    <label>Job Role/ Job Position</label>
                    <Input
                      placeholder="Ex. Full Stack"
                      required
                      value={jobPosition}
                      onChange={(e) => setJobPosition(e.target.value)}
                    />
                  </div>
                  <div className=" my-3 flex flex-col gap-2">
                    <label>Job Description/ Tech Stack</label>
                    <Textarea
                      placeholder="Ex. React, NodeJs, Angular, MySQL"
                      required
                      value={jobDescription}
                      onChange={(e) => setJobDescription(e.target.value)}
                    />
                  </div>
                  <div className=" my-3 flex flex-col gap-2">
                    <label>Years of Experience</label>
                    <Input
                      placeholder="5"
                      type="number"
                      max="50"
                      required
                      value={jobExperience}
                      onChange={(e) => setJobExperience(e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex gap-5 justify-end">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => {
                      setOpenDialog(false);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={loading}>
                    {loading ? (
                      <>
                        <LoaderCircle className="animate-spin" /> Generating
                        from AI
                      </>
                    ) : (
                      "Start Interview"
                    )}
                  </Button>
                </div>
              </form>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AddNewInterview;
