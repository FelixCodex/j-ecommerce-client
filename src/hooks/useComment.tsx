import { useContext } from "react";
import { CommentContext } from "../context/comments.context";

export const useComment = () => {
  const context = useContext(CommentContext);
  if (context == undefined) {
    throw new Error("useComment must be used within aProductProvider");
  }
  return context;
};
