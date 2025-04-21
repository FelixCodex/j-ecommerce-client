import { CartProduct } from "../types";

export const cartInitialState: CartProduct[] = [];

export const CART_ACTIONS = {
  ADD_TO_CART: "ADD_TO_CART",
  REMOVE_FROM_CART: "REMOVE_FROM_CART",
  SET_CART: "SET_CART",
  CLEAR_CART: "CLEAR_CART",
};

export const cartReducer = (
  state: CartProduct[],
  action: { type: string; payload: CartProduct | string | CartProduct[] }
) => {
  const { type: actionType, payload: actionPayload } = action;

  switch (actionType) {
    case CART_ACTIONS.SET_CART: {
      return actionPayload as CartProduct[];
    }
    case CART_ACTIONS.CLEAR_CART: {
      return [] as CartProduct[];
    }
    default:
      return state;
  }
};
