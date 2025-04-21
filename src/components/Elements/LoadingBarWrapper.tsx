import { useEffect } from "react";
import { useUtils } from "../../hooks/useUtils";
import LoadingBar from "./LoadingBar";
import "../../Loader.css";

export function LoadingBarWrapper() {
  const { isLoading, setIsLoading } = useUtils();
  useEffect(() => {
    setIsLoading(true);
  }, [setIsLoading]);
  return (
    <>
      <LoadingBar isLoading={isLoading} />
      <div className="flex items-center justify-center h-screen bg-[--bg_prim]">
        <div className="flex-col gap-4 w-full flex items-center justify-center">
          <svg className="pl" width="240" height="240" viewBox="0 0 240 240">
            <circle
              className="pl__ring pl__ring--a"
              cx="120"
              cy="120"
              r="105"
              fill="none"
              stroke="#000"
              strokeWidth="20"
              strokeDasharray="0 660"
              strokeDashoffset="-330"
              strokeLinecap="round"
            ></circle>
            <circle
              className="pl__ring pl__ring--b"
              cx="120"
              cy="120"
              r="35"
              fill="none"
              stroke="#000"
              strokeWidth="20"
              strokeDasharray="0 220"
              strokeDashoffset="-110"
              strokeLinecap="round"
            ></circle>
            <circle
              className="pl__ring pl__ring--c"
              cx="85"
              cy="120"
              r="70"
              fill="none"
              stroke="#000"
              strokeWidth="20"
              strokeDasharray="0 440"
              strokeLinecap="round"
            ></circle>
            <circle
              className="pl__ring pl__ring--d"
              cx="155"
              cy="120"
              r="70"
              fill="none"
              stroke="#000"
              strokeWidth="20"
              strokeDasharray="0 440"
              strokeLinecap="round"
            ></circle>
          </svg>
        </div>
      </div>
    </>
  );
}

{
  /* <div className="w-28 h-28 border-8 text-indigo-600 text-4xl animate-spin border-gray-300 flex items-center justify-center border-t-indigo-600 rounded-full">
  <div className="flex-col gap-4 w-full flex items-center justify-center">
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      height="1em"
      width="1em"
      className="animate-ping"
    >
      <path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.337 6.182 14.976 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624 1.177 1.194 2.538 2.576 5.512 2.576 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.337 13.382 8.976 12 6.001 12z"></path>
    </svg>
  </div>
</div>; */
}

{
  /* <svg className="pl" width="240" height="240" viewBox="0 0 240 240">
  <circle
    className="pl__ring pl__ring--a"
    cx="120"
    cy="120"
    r="105"
    fill="none"
    stroke="#000"
    stroke-width="20"
    stroke-dasharray="0 660"
    stroke-dashoffset="-330"
    stroke-linecap="round"
  ></circle>
  <circle
    className="pl__ring pl__ring--b"
    cx="120"
    cy="120"
    r="35"
    fill="none"
    stroke="#000"
    stroke-width="20"
    stroke-dasharray="0 220"
    stroke-dashoffset="-110"
    stroke-linecap="round"
  ></circle>
  <circle
    className="pl__ring pl__ring--c"
    cx="85"
    cy="120"
    r="70"
    fill="none"
    stroke="#000"
    stroke-width="20"
    stroke-dasharray="0 440"
    stroke-linecap="round"
  ></circle>
  <circle
    className="pl__ring pl__ring--d"
    cx="155"
    cy="120"
    r="70"
    fill="none"
    stroke="#000"
    stroke-width="20"
    stroke-dasharray="0 440"
    stroke-linecap="round"
  ></circle>
</svg>; */
}

{
  /* <div className="w-28 h-28 border-8 text-indigo-500 text-4xl animate-spin border-gray-300 flex items-center justify-center border-t-indigo-500 rounded-full">
  <svg
    className="w-16 h-16 text-indigo-500 animate-ping"
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    viewBox="0 0 24 24"
  >
    <circle cx="12" cy="12" r="10" />
  </svg>
</div>; */
}
