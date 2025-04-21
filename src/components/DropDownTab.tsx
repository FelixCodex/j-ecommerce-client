import { ChevronDownIcon, ChevronUp } from "lucide-react";

export function DropDownTab({
  id,
  question,
  answer,
  currentQuestion,
  setCurrentQuestion,
}: {
  id: string;
  question: string;
  answer: string;
  currentQuestion: string;
  setCurrentQuestion: (id: string) => void;
}) {
  return (
    <div
      className={`w-full flex ${
        currentQuestion == id ? "gap-2 " : "gap-0"
      } flex-col p-3 border cursor-pointer shadow-md border-[--border_light_300] rounded-lg`}
      onClick={() =>
        currentQuestion == id ? setCurrentQuestion("") : setCurrentQuestion(id)
      }
    >
      <div className="w-full flex justify-between items-center gap-1">
        <p className="text-md">{question}</p>
        {currentQuestion == id ? (
          <ChevronUp className="text-[--text_light_200]" />
        ) : (
          <ChevronDownIcon className="text-[--text_light_200]" />
        )}
      </div>
      <div
        className={`${
          currentQuestion == id ? "max-h-80 " : "max-h-0 "
        } transition-[max-height] duration-1000 overflow-hidden`}
      >
        <p>{answer}</p>
      </div>
    </div>
  );
}
