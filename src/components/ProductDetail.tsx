import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useCart } from "../hooks/useCart";
import { Product } from "../types";
import { CircleDashed, Download, ShoppingCart, X } from "lucide-react";
import { IMG_API_URL, LANGUAGE } from "../consts";
import { usePreferences } from "../hooks/usePreferences";

const specs = {
  platform: "Windows, Mac, Linux",
  releaseDate: "2024-03-15",
  developer: "GameStudio Pro",
  publisher: "Digital Publishing Co.",
  languages: ["English", "Spanish", "French", "German"],
  size: "25 GB",
};

interface ProductDetailsProps {
  product: Product;
  onClose: () => void;
  handleProductAction: (
    id: string,
    isInCart: boolean,
    isInPurchased: boolean,
    setLoadingSubmit: (b: boolean) => void
  ) => void;
  isOpen: boolean;
  setCurrentImage: (string: string) => void;
  currentImage: string | null;
  checkProductInCart: (product: Product) => boolean;
  checkProductInPurchased: (product: Product) => boolean;
}

export function ProductDetails({
  product,
  onClose,
  isOpen,
  handleProductAction,
  setCurrentImage,
  currentImage,
  checkProductInCart,
  checkProductInPurchased,
}: ProductDetailsProps) {
  const { user } = useAuth();
  const { state: cart, rate } = useCart();
  const [isInCart, setIsInCart] = useState<boolean>(false);
  const [isInPurchased, setIsInPurchased] = useState<boolean>(false);
  const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false);
  const { preferences } = usePreferences();

  useEffect(() => {
    setIsInCart(checkProductInCart(product));
    setIsInPurchased(checkProductInPurchased(product));
  }, [cart, checkProductInCart, checkProductInPurchased, product]);

  const handleMouseEnter = (e: React.MouseEvent<HTMLImageElement>) => {
    if (currentImage != e.currentTarget.src) {
      setCurrentImage(e.currentTarget.src);
    }
  };

  useEffect(() => {
    if (isInCart) {
      if (loadingSubmit) {
        setLoadingSubmit(false);
      }
    }
  }, [isInCart, loadingSubmit]);

  return (
    <div
      className={`relative overflow-y-auto w-full lg:w-[500px] xl:w-[650px] 2xl:w-[800px] max-h-screen bg-white shadow-xl transition-transform duration-300 
        ease-out right-0 top-0  lg:left-[calc(100%-500px)] xl:left-[calc(100%-650px)] 2xl:left-[calc(100%-800px)] ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
    >
      <button
        onClick={onClose}
        className="absolute right-0 top-0 z-10 p-2 hover:bg-gray-100 rounded-full transition-colors"
      >
        <X className="h-6 w-6" />
      </button>

      <div className="h-full overflow-y-auto">
        <div className="p-6">
          <div className="relative aspect-square mt-3 bg-gray-100 rounded-lg overflow-hidden group">
            <img
              src={product.gallery ? `${currentImage}` : ""}
              alt={product.title}
              className="w-full h-full object-contain"
            />
          </div>
          <div className="w-full flex flex-row flex-wrap max-w-3xl gap-2 mt-2 mb-6">
            <img
              key={"main-image"}
              src={`${IMG_API_URL}${product.image}.webp`}
              alt={`Preview main-image`}
              onMouseEnter={handleMouseEnter}
              className="w-14 h-14 object-cover rounded-md border-2 border-gray-300"
            />
            {product.gallery ? (
              product.gallery.map((image, index) => (
                <img
                  key={index}
                  src={`${IMG_API_URL}${image}.webp`}
                  alt={`Preview ${index + 1}`}
                  onMouseEnter={handleMouseEnter}
                  className="w-14 h-14 object-cover rounded-md border-2 border-gray-300"
                />
              ))
            ) : (
              <></>
            )}
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {product.title}
          </h2>
          <div className="flex items-center justify-between mb-6">
            <span className="text-3xl font-bold text-indigo-600">
              {LANGUAGE.CURRENCIES[preferences.currency]}
              {preferences.currency == "USD"
                ? rate == 1
                  ? product.price
                  : Math.floor((product.price / rate) * 100) / 100
                : product.price}
            </span>
            <button
              className={`flex items-center gap-2 px-6 py-3 ${
                isInPurchased
                  ? "bg-green-500 hover:bg-green-500"
                  : isInCart
                  ? "bg-blue-500 hover:bg-blue-500"
                  : "bg-indigo-600 hover:bg-indigo-700"
              } text-white rounded-lg  transition-colors`}
              onClick={() =>
                handleProductAction(
                  product.id,
                  isInCart,
                  isInPurchased,
                  setLoadingSubmit
                )
              }
            >
              {isInPurchased ? (
                <>
                  <Download className="h-5 w-5" />{" "}
                  {user
                    ? LANGUAGE.PRODUCT_BUTTON.DOWNLOAD[
                        user.preferences.language
                      ]
                    : LANGUAGE.PRODUCT_BUTTON.DOWNLOAD.en}
                </>
              ) : loadingSubmit ? (
                <>
                  <CircleDashed className="h-5 w-5 loader" />
                </>
              ) : isInCart ? (
                <>
                  <ShoppingCart className="h-5 w-5" />{" "}
                  {user
                    ? LANGUAGE.PRODUCT_BUTTON.GO_TO_CART[
                        user.preferences.language
                      ]
                    : LANGUAGE.PRODUCT_BUTTON.GO_TO_CART.en}
                </>
              ) : (
                <>
                  <ShoppingCart className="h-5 w-5" />
                  {user
                    ? LANGUAGE.PRODUCT_BUTTON.ADD[user.preferences.language]
                    : LANGUAGE.PRODUCT_BUTTON.ADD.en}
                </>
              )}
            </button>
          </div>

          <div className="prose max-w-none mb-8">
            <h3 className="text-lg font-semibold mb-2">Description</h3>
            <p className="whitespace-pre-line">{product.description}</p>
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">Specifications</h3>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
              {Object.entries(specs).map(([key, value]) => (
                <div key={key} className="flex flex-col py-2 border-b">
                  <dt className="text-sm text-gray-500 capitalize">{key}</dt>
                  <dd className="text-sm font-medium text-gray-900">
                    {Array.isArray(value) ? value.join(", ") : value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
