import { useContext } from "react";
import { ProductContext } from "../context/products.context";

export const useProduct = () => {
  const context = useContext(ProductContext);
  if (context == undefined) {
    throw new Error("useProduct must be used within aProductProvider");
  }
  return context;
};
