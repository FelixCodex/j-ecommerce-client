import type { Preferences, PurchasedProduct } from "../types";
import { IMG_API_URL, LANGUAGE } from "../consts";
import { createDateTextFromLanguage } from "../utils";
import { useCallback, useRef, useState } from "react";
import { RefreshCw, X } from "lucide-react";
import { download } from "../Api/download";

interface ProductCardProps {
  product: PurchasedProduct;
  preferences: Preferences;
}

const initialProgressDataState = {
  progress: 0,
  speed: 0,
  estTime: 0,
};

const initialLastRecordState = { loaded: 0, time: 0 };
const initialWeightState = { loaded: 0, total: 0 };

export function PurchasedProductCard({
  product,
  preferences,
}: ProductCardProps) {
  const date = new Date(product.purchased_at);

  const lastRecord = useRef(initialLastRecordState);
  const [progressData, setProgressData] = useState(initialProgressDataState);
  const [weightData, setWeightData] = useState(initialWeightState);
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const controller = useRef<AbortController | null>(null);

  const handleDownload = async () => {
    setIsDownloading(true);
    setError(null);
    controller.current = new AbortController();
    try {
      const res = await download(
        product.id,
        controller.current,
        (progressEvent) => {
          const loaded = progressEvent.loaded;
          const total = progressEvent.total
            ? progressEvent.total
            : progressEvent.loaded;
          const actualTime = new Date().getTime();

          const percentCompleted = Math.round((loaded * 100) / total);

          const timePassed = (actualTime - lastRecord.current.time) / 1000;
          const bitesUploaded =
            progressEvent.loaded - lastRecord.current.loaded;

          const speed = bitesUploaded / timePassed;

          const rest = Math.floor(total - loaded);

          const estimatedTime = rest / speed;
          console.log(progressEvent.loaded);

          lastRecord.current = { loaded, time: actualTime };

          setWeightData({ loaded, total });
          setProgressData({
            progress: percentCompleted,
            speed,
            estTime: estimatedTime,
          });
        }
      );
      if (!res) return;

      const blob = new Blob([res.data], { type: "application/zip" });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      console.log(res);
      link.download = `${product.title}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      if (err.name === "AbortError" || err.name === "CanceledError") return;
      console.error(err);
      setError("Something went wrong");
    } finally {
      setDataToDefault();
    }
  };

  const handleCancel = () => {
    controller.current?.abort();
    setDataToDefault();
  };

  const setDataToDefault = () => {
    setIsDownloading(false);
    lastRecord.current = initialLastRecordState;
    setProgressData(initialProgressDataState);
    setWeightData(initialWeightState);
  };

  const estimatedTime = useCallback(() => {
    const data = progressData.estTime;
    return `${Math.floor(
      data > 60 ? (data > 3600 ? data / 3600 : data / 60) : data
    )}${data > 60 ? (data > 3600 ? "h" : "m") : "s"}`;
  }, [progressData]);

  const velocity = useCallback(() => {
    const data = progressData.speed;
    return `${Math.floor(
      data > 1000 ? (data > 1000000 ? data / 1000000 : data / 1000) : data
    )}${data > 1000 ? (data > 1000000 ? "MB" : "KB") : "B"}/s`;
  }, [progressData]);

  const loaded = useCallback(() => {
    const data = weightData.loaded;
    return `${(data > 1000000000 ? data / 1000000000 : data / 1000000).toFixed(
      2
    )}${data > 1000000000 ? "GB" : "MB"}`;
  }, [weightData]);

  const total = useCallback(() => {
    const data = weightData.total;
    return `${(data > 1000000000 ? data / 1000000000 : data / 1000000).toFixed(
      2
    )}${data > 1000000000 ? "GB" : "MB"}`;
  }, [weightData]);

  return (
    <div className="border border-[--border_light_400] rounded-lg p-4">
      <img
        src={`${IMG_API_URL}${product.image}.webp`}
        alt={product.title}
        draggable={false}
        className="w-full h-72 object-cover rounded-lg aspect-auto text-[--text_light_0] bg-[--bg_prim]"
      />
      <h3 className="mt-4 text-lg font-semibold text-[--text_light_0]">
        {product.title}
      </h3>
      <p className="text-sm mt-1  text-[--text_light_0]">{`${
        LANGUAGE.DASHBOARD.PURCHASED_AT[preferences.language]
      } ${createDateTextFromLanguage(preferences.language, date)}`}</p>
      {error ? (
        <button
          className="mt-4 w-full flex flex-wrap justify-center items-center gap-2 bg-red-300 hover:bg-red-400 border border-red-500  py-2 rounded-lg"
          disabled={isDownloading}
          onClick={handleDownload}
        >
          <span>{LANGUAGE.DASHBOARD.WRONG[preferences.language]}</span>
          <span className="flex gap-2 items-center justify-center">
            {LANGUAGE.DASHBOARD.TRY[preferences.language]}
            <RefreshCw className="h-5 w-5"></RefreshCw>
          </span>
        </button>
      ) : isDownloading ? (
        <div className="mt-4 h-fit flex w-full rounded-lg">
          <div className="w-full h-[3.75rem] rounded-lg">
            <div className="w-full h-10 bg-[--bg_light_400] shadow-inner shadow-[--bg_light_300] rounded-lg">
              <div
                className="bg-[--button_purchased] shadow-inner shadow-[#ca3662] max-w-full flex items-center justify-end h-10 rounded-lg"
                style={{ width: `${progressData.progress}%` }}
              >
                <p
                  className={`text-lg font-medium text-[--text_light_900] ${
                    progressData.progress > 10 ? "mr-3" : "-mr-8"
                  }`}
                >
                  {`${progressData.progress}%`}
                </p>
              </div>
            </div>
            <div className="w-full flex justify-between items-center px-1 h-5">
              <div className="flex items-center justify-center gap-2">
                <p className="text-sm font-medium">
                  {LANGUAGE.DASHBOARD.SPEED[preferences.language]}: {velocity()}
                </p>
                <p className="text-sm font-medium">
                  {LANGUAGE.DASHBOARD.ESTTIME[preferences.language]}:{" "}
                  {estimatedTime()}
                </p>
              </div>
              <p className="text-sm font-medium">
                {loaded()}/{total()}
              </p>
            </div>
          </div>
          <div className="w-10 flex items-center justify-end h-full">
            <X
              className="h-10 w-10 p-1 transition-colors  hover:bg-[--bg_light_500] border border-transparent hover:border-[--border_light_400] rounded-full"
              onClick={handleCancel}
            ></X>
          </div>
        </div>
      ) : (
        <button
          className="mt-4 w-full bg-[--button_purchased] text-[--text_light_900] py-2 rounded-lg hover:bg-[--button_purchased_hover]"
          disabled={isDownloading}
          onClick={handleDownload}
        >
          {LANGUAGE.DASHBOARD.DOWNLOAD[preferences.language]}
        </button>
      )}
    </div>
  );
}

/*
const paused = useRef(false);
  const loadedRef = useRef(0);
  const controller = useRef<AbortController | null>(null);

  const handleDownload = async () => {
    try {
      await startDownload();
    } catch (err: any) {
      if (err.name === "AbortError") return;
      console.error(err);
    }
  };

  const startDownload = async () => {
    setIsDownloading(true);
    controller.current = new AbortController();
    const response = await fetch(`${API_URL}/download/${product.id}`, {
      signal: controller.current?.signal,
      headers:
        loadedRef.current > 0
          ? { Range: `bytes=${loadedRef.current}-` }
          : undefined,
      credentials: "include",
    });

    const contentLength = response.headers.get("content-length");
    const total = parseInt(`${contentLength}`, 10);

    const reader = response.body.getReader();

    const stream = new ReadableStream({
      start(controller) {
        function push() {
          if (paused.current) return;
          reader.read().then(({ done, value }) => {
            if (done) {
              controller.close();
              return;
            }
            setIsDownloading(true);
            const loaded = loadedRef.current;

            loadedRef.current += value.length;
            const actualTime = new Date().getTime();
            const percentCompleted = Math.round((loaded * 100) / total);
            console.log("Loaded: ", loaded);

            const timePassed = (actualTime - lastRecord.time) / 1000;
            const bitesUploaded = loaded - lastRecord.loaded;
            const speed = bitesUploaded / timePassed;
            const rest = Math.floor(total - loaded);
            const estimatedTime = rest / speed;

            setLastRecord({ loaded, time: actualTime });

            setProgressData({
              progress: percentCompleted,
              speed,
              estTime: estimatedTime,
            });

            controller.enqueue(value);
            push();
          });
        }

        push();
      },
    });

    if (response.status != 200) {
      setIsDownloading(false);
      loadedRef.current = 0;
      return;
    }

    const blob = await new Response(stream).blob();
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = response.headers.filename;
    a.click();
    URL.revokeObjectURL(url);

    setProgressData(initialProgressDataState);
    setLastRecord(initialLastRecordState);

    setIsDownloading(false);
  };

  const handlePause = () => {
    paused.current = true;
  };

  const handleResume = () => {
    paused.current = false;
    startDownload();
  };

  const handleCancel = () => {
    controller.current?.abort();
    loadedRef.current = 0;
    paused.current = false;
    setIsDownloading(false);
    setProgressData(initialProgressDataState);
    setLastRecord(initialLastRecordState);
  };

  {paused.current ? (
    <Play
      className="h-9 w-9 p-1 transition-colors  hover:bg-[--bg_light_500] border border-transparent hover:border-[--border_light_400] rounded-full"
      onClick={handleResume}
    ></Play>
    ) : (
    <Pause
      className="h-9 w-9 p-1 transition-colors  hover:bg-[--bg_light_500] border border-transparent hover:border-[--border_light_400] rounded-full"
      onClick={handlePause}
    ></Pause>
  )}         
*/
