import { useContext } from "react";
import { DownloadContext } from "../context/download.context";

export const useDownload = () => {
  const context = useContext(DownloadContext);
  if (context == undefined) {
    throw new Error("useDownload must be used within aProductProvider");
  }
  return context;
};
