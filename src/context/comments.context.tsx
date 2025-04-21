import { createContext, useCallback, useEffect, useState } from "react";
import { Comment } from "../types";
import { createCommentRequest, getCommentsRequest } from "../Api/comment";

interface CommentContextType {
  comments: Comment[];
  loadingComments: boolean;
  addComment: (comment: Comment) => void;
  clearComments: () => void;
  createComment: (comment: Comment) => void;
  commentsLoading: Comment[];
  commentsError: Comment[];
}

interface CommentProviderProps {
  children: import("react").ReactElement;
}

export const CommentContext = createContext<CommentContextType>({
  comments: [],
  loadingComments: true,
  addComment: () => {},
  clearComments: () => {},
  createComment: () => {},
  commentsLoading: [],
  commentsError: [],
});

export function CommentProvider({ children }: CommentProviderProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loadingComments, setLoadingComments] = useState(true);
  const [commentsLoading, setCommentsLoading] = useState<Comment[]>([]);
  const [commentsError, setCommentsError] = useState<Comment[]>([]);

  const addComment = useCallback((comment: Comment) => {
    setComments((prevComm) => [comment, ...prevComm]);
  }, []);

  const createComment = async (comment: Comment) => {
    try {
      addCommentToLoading(comment);
      const res = await createCommentRequest({
        message: comment.comment,
        productId: comment.productId,
      });
      console.log("Response from create comment: ", res);
      if (!res) throw new Error("Create Comment request failed");
      if (res.status == 200) {
        addComment(comment);
      } else {
        addCommentToError(comment);
      }
      removeCommentToLoading(comment.id);
    } catch (error) {
      console.log("Error creating comment data: ", error);
    }
  };

  const clearComments = () => {
    setComments([] as Comment[]);
    return [];
  };

  const addCommentToLoading = (comment: Comment) => {
    setCommentsLoading((prev) => [...prev, comment]);
  };

  const removeCommentToLoading = (id: string) => {
    setCommentsLoading((prev) => prev.filter((el) => el.id != id));
  };

  const addCommentToError = (comment: Comment) => {
    setCommentsError((prev) => [...prev, comment]);
  };

  const loadComments = async () => {
    setLoadingComments(true);
    try {
      const res = await getCommentsRequest();
      console.log("Response from comment: ", res);
      if (!res) throw new Error("Comment request failed");
      if (res.status == 200) {
        setComments(res.data);
      } else {
        setComments([] as Comment[]);
      }
    } catch (error) {
      console.log("Error fetching comment data: ", error);
      setComments([] as Comment[]);
    } finally {
      setLoadingComments(false);
    }
  };

  useEffect(() => {
    loadComments();
  }, []);

  return (
    <CommentContext.Provider
      value={{
        comments,
        loadingComments,
        addComment,
        clearComments,
        commentsError,
        commentsLoading,
        createComment,
      }}
    >
      {children}
    </CommentContext.Provider>
  );
}
