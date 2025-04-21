import { AxiosProgressEvent } from "axios";
import axios from "./axios.ts";

export const download = async (
  id: string,
  controller: AbortController,
  callback?: (progressEvent: AxiosProgressEvent) => void
) => {
  try {
    return await axios.get(`/download/${id}`, {
      signal: controller.signal,
      responseType: "blob",
      onDownloadProgress: (progressEvent) => {
        if (callback) callback(progressEvent);
      },
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
};
