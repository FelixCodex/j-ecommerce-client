import { License } from "../types/index.ts";
import axios from "./axios.ts";

export const getCartRequest = async () => {
  try {
    return await axios.get(`/cart`);
  } catch (error) {
    console.log(error);
  }
};

export const addProductToCartRequest = async ({
  id,
  l,
}: {
  id: string;
  l: License;
}) => {
  try {
    return await axios.post(`/cart/add`, { id, license: l });
  } catch (error) {
    console.log(error);
  }
};

export const removeProductFromCartRequest = async (id: string) => {
  try {
    return await axios.post(`/cart/remove`, { id });
  } catch (error) {
    console.log(error);
  }
};

export const clearCartRequest = async () => {
  try {
    return await axios.post(`/cart/clear`);
  } catch (error) {
    console.log(error);
  }
};

export const getPaymentsRequest = async () => {
  try {
    return await axios.get(`/payments`);
  } catch (error) {
    console.log(error);
  }
};

export const validateCouponRequest = async (id: string) => {
  try {
    return await axios.post(`/cart/coupon/validate`, { id });
  } catch (error) {
    console.log(error);
  }
};
