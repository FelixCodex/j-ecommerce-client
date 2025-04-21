import { useContext } from "react";
import { AuthContext } from "../context/auth.context";

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context == undefined) {
    throw new Error("useAuth must be used within a CartProvider");
  }
  return context;
};
