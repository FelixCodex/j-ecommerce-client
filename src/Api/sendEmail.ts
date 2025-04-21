import axios from "./axios.ts";

export const sendMailRequest = async (data: {
  name: string;
  email: string;
  message: string;
}) => {
  try {
    return await axios.post(`/send-mail`, data);
  } catch (error) {
    console.log(error);
  }
};
