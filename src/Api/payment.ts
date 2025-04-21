import axios from "./axios.ts";

export const getPurchasedRequest = async () => {
  try {
    return await axios.get(`/purchases`);
  } catch (error) {
    console.log(error);
  }
};

export const getRateRequest = async () => {
  try {
    return await axios.get(`/rate`);
  } catch (error) {
    console.log(error);
  }
};

export const getPaymentRequest = async (reference: string) => {
  try {
    return await axios.post(`/paymentui`, { id: reference });
  } catch (error) {
    console.log(error);
  }
};
