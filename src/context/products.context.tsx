import { createContext, useEffect, useState } from "react";
import { getProductsRequest } from "../Api/products";
import { Product } from "../types";

interface ProductContextType {
  products: Product[] | null;
  loadingProducts: boolean;
}

interface ProductProviderProps {
  children: import("react").ReactElement;
}

export const ProductContext = createContext<ProductContextType>({
  products: null,
  loadingProducts: true,
});

const localProducts = localStorage.getItem("products");
const initialProductState =
  localProducts != null && localProducts != "null"
    ? JSON.parse(localProducts)
    : null;

export function ProductProvider({ children }: ProductProviderProps) {
  const [products, setProducts] = useState<Product[] | null>(
    initialProductState
  );
  const [loadingProducts, setLoadingProducts] = useState(true);

  const saveInLocal = (products: Product[]) => {
    localStorage.setItem("products", JSON.stringify(products));
  };

  const getProducts = async () => {
    setLoadingProducts(true);
    try {
      const res = await getProductsRequest();
      console.log("Response from products: ", res);
      if (!res) throw new Error("Products request failed");
      if (res.status == 200) {
        console.log(res.data);
        setProducts(res.data);
        saveInLocal(res.data);
      } else {
        setProducts([] as Product[]);
      }
    } catch (error) {
      console.log("Error fetching products data: ", error);
    } finally {
      setLoadingProducts(false);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  return (
    <ProductContext.Provider value={{ products, loadingProducts }}>
      {children}
    </ProductContext.Provider>
  );
}
