import { Preferences } from "../types/index.ts";
import axios from "./axios.ts";

export const registerRequest = async (user: {
  username: string;
  email: string;
  password: string;
}) => {
  try {
    return await axios.post(`/register`, user);
  } catch (error) {
    console.log(error);
  }
};

export const loginRequest = async (user: {
  email: string;
  password: string;
}) => {
  return await axios.post(`/login`, user);
};

export const verifyTokenRequest = async () => {
  try {
    return await axios.get(`/verify`);
  } catch (error) {
    console.log(error);
  }
};

export const googleAuthRequest = async () => {
  try {
    return await axios.get(`/auth/google`);
  } catch (error) {
    console.log(error);
  }
};

export const logoutRequest = async () => {
  try {
    return await axios.get(`/logout`);
  } catch (error) {
    console.log(error);
  }
};

export const preferencesRequest = async (preferences: Preferences) => {
  try {
    return await axios.post(`/preferences`, { preferences });
  } catch (error) {
    console.log(error);
  }
};
