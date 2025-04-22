/* eslint-disable @typescript-eslint/no-unused-vars */
import { createContext, useRef, useState } from "react";
import { download } from "../Api/download";
import { LastRecordI, ProgressDataI } from "../types";

interface DownloadContextType {
  lastRecord: LastRecordI[];
  progressData: ProgressDataI[];
  startDownload: (
    id: string,
    title: string,
    controller: AbortController,
    onFinish?: () => void
  ) => void;
}

interface DownloadProviderProps {
  children: import("react").ReactElement;
}

export const DownloadContext = createContext<DownloadContextType>({
  lastRecord: [],
  progressData: [],
  startDownload: (
    id: string,
    title: string,
    controller: AbortController,
    onFinish?: () => void
  ) => {},
});

export function DownloadProvider({ children }: DownloadProviderProps) {
  const lastRecord = useRef<LastRecordI[]>([]);
  const [progressData, setProgressData] = useState<ProgressDataI[]>([]);

  const startDownload = async (
    id: string,
    title: string,
    controller: AbortController,
    onFinish?: () => void
  ) => {
    lastRecord.current = [...lastRecord.current, { id, loaded: 0, time: 0 }];
    setProgressData((prev) => [
      ...prev,
      {
        id,
        title,
        progress: 0,
        speed: 0,
        estTime: 0,
        loaded: 0,
        total: 0,
        controller,
      },
    ]);

    try {
      const res = await download(id, controller, (progressEvent) => {
        const loaded = progressEvent.loaded;
        const total = progressEvent.total
          ? progressEvent.total
          : progressEvent.loaded;
        const actualTime = new Date().getTime();

        const lostRecorded = lastRecord.current.find((el) => el.id == id) ?? {
          id,
          loaded: 0,
          time: 0,
        };

        const percentCompleted = Math.round((loaded * 100) / total);

        const timePassed = (actualTime - lostRecorded.time) / 1000;
        const bitesUploaded = progressEvent.loaded - lostRecorded.loaded;

        const speed = bitesUploaded / timePassed;

        const rest = Math.floor(total - loaded);

        const estimatedTime = rest / speed;

        const record = { id, loaded, time: actualTime };
        const progress = {
          id,
          title,
          progress: percentCompleted,
          speed,
          estTime: estimatedTime,
          loaded,
          total,
          controller,
        };

        lastRecord.current = lastRecord.current.map((el) =>
          el.id == id ? record : el
        );

        setProgressData((prev) => {
          return prev.map((el) => (el.id == id ? progress : el));
        });
      });
      if (!res) return;

      const blob = new Blob([res.data], { type: "application/zip" });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      console.log(res);
      link.download = `${title}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.log(error);
      throw error;
    } finally {
      lastRecord.current = lastRecord.current.filter((el) => el.id != id);
      setProgressData((prev) => prev.filter((el) => el.id != id));
      onFinish?.();
    }
  };

  return (
    <DownloadContext.Provider
      value={{
        lastRecord: lastRecord.current,
        progressData,
        startDownload,
      }}
    >
      {children}
    </DownloadContext.Provider>
  );
}
