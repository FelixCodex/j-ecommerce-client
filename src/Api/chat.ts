import axios from "./axios.ts";

export const sendMessageRequest = async (message: string) => {
  try {
    return await axios.post(`/message/create`, { message });
  } catch (error) {
    console.log(error);
  }
};

export const getMessagesRequest = async () => {
  try {
    return await axios.get(`/messages/user`);
  } catch (error) {
    console.log(error);
  }
};
