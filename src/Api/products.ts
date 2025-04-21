import axios from "./axios.ts";

export const getProductsRequest = async () => {
  try {
    return await axios.get(`/products`);
  } catch (error) {
    console.log(error);
  }
};

export const getProductRequest = async (id: string) => {
  try {
    return await axios.get(`/product/${id}`);
  } catch (error) {
    console.log(error);
  }
};
