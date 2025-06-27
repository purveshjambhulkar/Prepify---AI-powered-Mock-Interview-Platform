import { useState } from "react";
import { Lightbulb, Volume2 } from "lucide-react";

function QuestionsSection({ mockInterviewQuestion, activeQuestionIndex, setActiveQuestionIndex }) {
  const textToSpeech = (text) => {
    if ('speechSynthesis' in window) {
      const speech = new SpeechSynthesisUtterance(text);
      speech.lang = 'en-US';
      speech.volume = 1;
      speech.rate = 1;
      speech.pitch = 1;
      window.speechSynthesis.speak(speech);
    } else {
      alert("Sorry, your browser does not support text to speech");
    }
  };

  return (
    mockInterviewQuestion && (
      <div className="p-5 border rounded-lg my-3">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {mockInterviewQuestion.map((question, index) => (
            <h2
              key={index}
              className={`p-5 bg-secondary rounded-lg text-xs md:text-sm text-center cursor-pointer ${
                activeQuestionIndex === index ? 'bg-blue-400 font-bold' : ''
              }`}
              onClick={() => setActiveQuestionIndex(index)}
            >
              Question #{index + 1}
            </h2>
          ))}
        </div>
        <h2 className="my-5 text-md md:text-lg">
          {mockInterviewQuestion[activeQuestionIndex]?.Question}
        </h2>
        <Volume2
          className="cursor-pointer"
          onClick={() => textToSpeech(mockInterviewQuestion[activeQuestionIndex]?.Question)}
        />
        <div className="border rounded-lg p-5 bg-blue-100 my-10">
          <h2 className="flex gap-2 items-center text-primary">
            <Lightbulb />
            <strong>Note:</strong>
          </h2>
          <h2 className="text-sm text-primary my-2">
            {process.env.NEXT_PUBLIC_QUESTION_NOTE}
          </h2>
        </div>
      </div>
    )
  );
}

export default QuestionsSection;
