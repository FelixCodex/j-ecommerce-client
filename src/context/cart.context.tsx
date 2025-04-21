/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  ReactNode,
  createContext,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react";
import {
  CART_ACTIONS,
  cartInitialState,
  cartReducer,
} from "../reducers/cart.reducer.ts";
import {
  addProductToCartRequest,
  getCartRequest,
  removeProductFromCartRequest,
} from "../Api/cart.ts";
import { CartProduct, License, PurchasedProduct } from "../types/index.ts";
import { getPurchasedRequest, getRateRequest } from "../Api/payment.ts";

export const CartContext = createContext({
  state: [] as CartProduct[],
  addToCart: (id: string, l: License) => {},
  removeFromCart: (id: string) => {},
  clearCart: () => {},
  clearPurchased: () => {},
  clearCartFromClient: () => {},
  loadCart: () => {},
  loadPurchased: () => {},
  loadingCart: false,
  loadingPurchased: true,
  purchased: [] as PurchasedProduct[],
  rate: 0,
});

function useCartReducer() {
  const [state, dispatch] = useReducer(cartReducer, cartInitialState);
  const [loadingCart, setLoadingCart] = useState(false);
  const [loadingPurchased, setLoadingPurchased] = useState(true);
  const [rate, setRate] = useState(1);
  const loadingcartQueue = useRef(false);
  const cartQueue = useRef<{ id: string; l: License }[]>([]);
  const [purchased, setPurchased] = useState([] as PurchasedProduct[]);

  const loadCart = async () => {
    if (loadingCart) return;
    setLoadingCart(true);
    try {
      console.log("Starting cart request");
      const res = await getCartRequest();
      console.log("Response from cart: ", res);
      if (!res) throw new Error("Cart request failed");
      if (res.status === 200) {
        dispatch({
          type: CART_ACTIONS.SET_CART,
          payload: res.data,
        });
      } else {
        console.error("Error loading cart");
      }
    } catch (error) {
      console.error("Error fetching cart data", error);
    } finally {
      setLoadingCart(false);
    }
  };

  const loadPurchased = async () => {
    setLoadingPurchased(true);
    try {
      const res = await getPurchasedRequest();
      if (!res) throw new Error("Purchases request failed");
      if (res.status === 200) {
        setPurchased(res.data);
      } else {
        console.error("Error loading purchased");
      }
    } catch (error) {
      console.error("Error fetching purchased data", error);
    } finally {
      setLoadingPurchased(false);
    }
  };

  const loadRate = async () => {
    try {
      const res = await getRateRequest();
      if (!res) throw new Error("Rate request failed");
      if (res.status === 200) {
        setRate(res.data.rate);
      } else {
        console.error("Error loading rate");
      }
    } catch (error) {
      console.error("Error fetching rate data", error);
    }
  };

  useEffect(() => {
    loadCart();
    loadPurchased();
    loadRate();
  }, []);

  const addToCart = async (id: string, l: License) => {
    cartQueue.current = [...cartQueue.current, { id, l }];
    if (!loadingcartQueue.current) {
      addToCartSequence();
    }
  };

  const addToCartSequence = async () => {
    if (cartQueue.current.length != 0) {
      loadingcartQueue.current = true;
      const res = await addProductToCartRequest({
        id: cartQueue.current[0].id,
        l: cartQueue.current[0].l,
      });

      if (!res) throw new Error("Add product request failed");
      if (res.status === 200) {
        dispatch({
          type: CART_ACTIONS.SET_CART,
          payload: res.data,
        });
      } else {
        console.error("Error adding product to cart");
      }
      cartQueue.current.splice(0, 1);
      addToCartSequence();
    } else {
      loadingcartQueue.current = false;
    }
  };

  const removeFromCart = async (id: string) => {
    const res = await removeProductFromCartRequest(id);

    if (!res) throw new Error("Remove product request failed");
    if (res.status === 200) {
      dispatch({
        type: CART_ACTIONS.SET_CART,
        payload: res.data,
      });
    } else {
      console.error("Error removing product from cart");
    }
  };

  const clearCart = async () => {
    dispatch({
      type: CART_ACTIONS.CLEAR_CART,
      payload: [],
    });
  };

  const clearPurchased = async () => {
    setPurchased([] as PurchasedProduct[]);
  };

  const clearCartFromClient = async () => {
    dispatch({
      type: CART_ACTIONS.CLEAR_CART,
      payload: [],
    });
  };

  return {
    state,
    addToCart,
    removeFromCart,
    loadingCart,
    clearCart,
    clearCartFromClient,
    loadCart,
    loadingPurchased,
    purchased,
    loadPurchased,
    clearPurchased,
    rate,
  };
}

export function CartProvider({ children }: { children: ReactNode }) {
  const {
    state,
    addToCart,
    removeFromCart,
    loadingCart,
    clearCart,
    clearCartFromClient,
    loadCart,
    loadingPurchased,
    purchased,
    loadPurchased,
    clearPurchased,
    rate,
  } = useCartReducer();

  return (
    <CartContext.Provider
      value={{
        state,
        addToCart,
        removeFromCart,
        loadingCart,
        clearCart,
        clearCartFromClient,
        loadCart,
        loadingPurchased,
        purchased,
        loadPurchased,
        clearPurchased,
        rate,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
