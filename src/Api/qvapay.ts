import axios from "./axios.ts";

export const paymentLinkRequest = async () => {
  try {
    return await axios.post(`/qvapay/paymentlink`);
  } catch (error) {
    console.log(error);
    return null;
  }
};
