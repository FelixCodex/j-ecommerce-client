import { License } from "../types/index.ts";
import axios from "./axios.ts";

export const paymentLinkRequest = async (data: {
  name: string;
  lastName: string;
  phoneNumber: string;
  address: string;
  country: number;
  city: string;
  postalCode: string;
}) => {
  try {
    return await axios.post(`/tpp/paymentlink`, data);
  } catch (error) {
    console.log(error);
  }
};

export const quickPaymentLinkRequest = async (data: {
  name: string;
  lastName: string;
  phoneNumber: string;
  address: string;
  country: number;
  city: string;
  postalCode: string;
  productId: string;
  license: License;
}) => {
  try {
    return await axios.post(`/tpp/quickpaymentlink`, data);
  } catch (error) {
    console.log(error);
  }
};
