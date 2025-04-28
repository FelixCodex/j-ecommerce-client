import { Clock, Download, X } from "lucide-react";
import { useDownload } from "../hooks/useDownload";
import { useCallback, useEffect, useId, useState } from "react";
import { SpeedMeter } from "./elements/SpeedMeter";

const gb = 1000000000;
const mb = 1000000;
const kb = 1000;
const h = 3600;
const m = 60;

function DownloadCard({
  id,
  title,
  progress,
  speed,
  estTime,
  loaded,
  total,
  controller,
}: {
  id: string;
  title: string;
  progress: number;
  speed: number;
  estTime: number;
  loaded: number;
  total: number;
  controller: AbortController;
}) {
  const rid = useId();

  const estimatedTime = useCallback(() => {
    const et = estTime;
    return `${(et > m ? (et > h ? et / h : et / m) : et).toFixed(0)}${
      et > m ? (et > h ? "h" : "m") : "s"
    }`;
  }, [estTime]);

  const velocity = useCallback(() => {
    const s = speed;
    return `${(s > kb ? (s > mb ? s / mb : s / kb) : s).toFixed(2)}${
      s > kb ? (s > mb ? "MB" : "KB") : "B"
    }/s`;
  }, [speed]);

  const loadedData = useCallback(() => {
    return `${(loaded > gb ? loaded / gb : loaded / mb).toFixed(2)}${
      loaded > gb ? "GB" : "MB"
    }`;
  }, [loaded]);

  const totalData = useCallback(() => {
    return `${(total > gb ? total / gb : total / mb).toFixed(2)}${
      total > gb ? "GB" : "MB"
    }`;
  }, [total]);

  return (
    <div
      id={rid}
      key={rid + "-" + id}
      className="flex flex-col w-full gap-1 p-2 hover:shadow-md transition-[box-shadow] border bg-[--bg_sec] border-[--brand_color] rounded-xl"
    >
      <div className="flex justify-between items-center">
        <p className="text-md font-medium">{title}</p>
        <p className="text-sm font-medium">
          {loadedData()}/{totalData()}
        </p>
      </div>
      <div className="flex justify-between items-center">
        <p>{progress}%</p>
        <div className="flex items-center justify-center gap-1">
          <SpeedMeter className="w-5 h-5"></SpeedMeter>
          <p className="text-sm font-medium">{velocity()}</p>|
          <Clock className="w-5 h-5"></Clock>
          <p className="text-sm font-medium">{estimatedTime()}</p>
        </div>
      </div>
      <div className="flex gap-2 items-center justify-between">
        <div className="w-full h-3 bg-[--bg_light_400] overflow-hidden rounded-full">
          <div
            className="h-full bg-[--button_purchased] transition-[width] rounded-full"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <X
          className="h-7 w-8 p-1 text-[--text_light_50] rounded-full border border-transparent hover:shadow-md hover:hover:bg-[--bg_sec] hover:hover:border-[--border_light_400]"
          onClick={() => {
            controller?.abort();
          }}
        ></X>
      </div>
    </div>
  );
}

export function DownloadNav({ className }: { className?: string }) {
  const { progressData } = useDownload();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (progressData.length == 0) {
      setIsOpen(false);
    }
  }, [progressData]);

  return (
    <nav
      className={`${className} w-full fixed justify-end transition-[margin] duration-300 px-4 pt-3 items-center ${
        progressData.length > 0 ? "flex" : "hidden"
      }`}
    >
      <div className="h-fit w-full relative md:w-72 flex flex-col justify-center items-end">
        <div
          className={`rounded-full p-3 bg-[--button] relative hover:bg-[--button_hover]`}
          onClick={() => {
            setIsOpen(!isOpen);
          }}
        >
          <Download className="w-5 h-5 text-[--text_light_900]"></Download>
          <div className="absolute -bottom-2 -left-2 select-none min-w-6 w-fit h-6 flex justify-center items-center bg-[--brand_color] border border-[--bg_prim] p-1 rounded-full">
            <p className="text-[--text_light_800] text-xs">
              {progressData.length}
            </p>
          </div>
        </div>
        <div
          className={`w-full h-fit rounded-xl bg-[--brand_color_900] border border-[--brand_color] absolute top-0 transition-transform duration-300 ${
            isOpen ? "translate-x-0" : "translate-x-[120%]"
          }`}
        >
          <div className="w-full flex justify-between items-center border-b border-[--border_light_300] p-2">
            <p className="text-lg font-medium text-[--text_light_100]">
              Downloads ({progressData.length})
            </p>
            <X
              className="h-9 w-9 p-1 text-[--text_light_50] rounded-full border border-transparent hover:shadow-md hover:hover:bg-[--bg_sec] hover:hover:border-[--border_light_400]"
              onClick={() => {
                setIsOpen(!isOpen);
              }}
            ></X>
          </div>
          <div className="w-full flex flex-col gap-2 max-h-96 overflow-auto items-center p-2 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-[--bg_light_400] [&::-webkit-scrollbar-thumb]:rounded-md">
            {progressData.map((el) => {
              return <DownloadCard {...el}></DownloadCard>;
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
