import axios from "./axios.ts";

export const createCommentRequest = async ({
  message,
  productId,
}: {
  message: string;
  productId: string;
}) => {
  try {
    return await axios.post(`/comment/create`, { message, productId });
  } catch (error) {
    console.log(error);
  }
};

export const getCommentsRequest = async () => {
  try {
    return await axios.get(`/comments`);
  } catch (error) {
    console.log(error);
  }
};
