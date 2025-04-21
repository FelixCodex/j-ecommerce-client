import { useContext } from "react";
import { UtilsContext } from "../context/utils.context";

export const useUtils = () => {
  const context = useContext(UtilsContext);
  if (context == undefined) {
    throw new Error("useUtils must be used within a CartProvider");
  }
  return context;
};
