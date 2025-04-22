export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  personal: number;
  professional: number;
  image: string;
  gallery?: string[];
  created_at: string;
  driveId: string;
  weight: number;
}

export type LastRecordI = {
  id: string;
  loaded: number;
  time: number;
};
export type ProgressDataI = {
  id: string;
  title: string;
  progress: number;
  speed: number;
  estTime: number;
  loaded: number;
  total: number;
  controller: AbortController;
};

export type PayMethods = "tpp" | "qvapay" | "asd";

export interface CartProduct {
  id: string;
  title: string;
  image: string;
  personal: number;
  professional: number;
  license: "personal" | "professional";
}

export interface ChatMessage {
  id: string;
  userId: string;
  isMessageFromUser: string;
  message: string;
  created_at: string;
}

export interface UserInterface {
  id: string;
  username: string;
  email: string;
  preferences: Preferences;
}

export type Language = "en" | "es";
export type Theme = "light" | "dark" | "system";
export type Currency = "USD" | "EUR";

export type PlacesUser = "/login" | "/register" | "/cart" | "/checkout";

export interface Payment {
  id: string;
  cart: CartProduct[];
  state: number;
  shortURL: string;
  created_at: string;
  price: string;
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  productId: string;
  comment: string;
  created_at: string;
}

export type Sections = "info" | "comments";

export const LicenseMap = ["personal", "professional"];
export type License = "personal" | "professional";

export interface Preferences {
  language: Language;
  currency: Currency;
  notifications: boolean;
}

export interface PurchasedProduct {
  id: string;
  title: string;
  image: string;
  purchased_at: string;
}
