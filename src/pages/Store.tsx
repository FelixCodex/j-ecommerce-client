import { CircleDashed } from "lucide-react";
import { useProduct } from "../hooks/useProduct";
import { LANGUAGE } from "../consts";
import { useNavigate } from "react-router-dom";
import { ProductCard } from "../components/ProductCard";
import { usePreferences } from "../hooks/usePreferences";
import { Product } from "../types";

export function Store() {
  const { products, loadingProducts } = useProduct();
  const { preferences } = usePreferences();
  const navigate = useNavigate();

  const handleProductClick = (productId: string) => {
    navigate(`/product/${productId}`);
    window.scrollTo({ top: 0 });
  };

  const renderProductGrid = (products: Product[]) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onClick={() => handleProductClick(product.id)}
        />
      ))}
    </div>
  );

  const renderLoading = () => (
    <div
      className="mt-12 flex items-center justify-center gap-2"
      role="status"
      aria-label="Loading products"
    >
      <CircleDashed
        className="loader h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 text-[--text_light_0]"
        aria-hidden="true"
      />
      <span className="text-2xl sm:text-4xl lg:text-4xl text-[--text_light_0]">
        {LANGUAGE.STORE.LOADING[preferences.language]}
      </span>
    </div>
  );

  const renderError = () => (
    <div className="text-2xl sm:text-3xl md:text-4xl mt-12 flex items-center justify-center text-[--text_light_0]">
      <p>{LANGUAGE.STORE.WRONG[preferences.language]}</p>
      <a
        className="ml-4 underline text-[--text_light_0]"
        href="/"
        aria-label={LANGUAGE.STORE.RELOAD[preferences.language]}
      >
        {LANGUAGE.STORE.RELOAD[preferences.language]}
      </a>
    </div>
  );

  const renderNoProducts = () => (
    <p
      className="text-2xl sm:text-3xl md:text-4xl mt-12 flex items-center justify-center text-[--text_light_0]"
      role="status"
      aria-label="No products available"
    >
      {LANGUAGE.STORE.NO_PRODUCTS[preferences.language]}
    </p>
  );

  const renderContent = () => {
    if (!products) {
      return loadingProducts ? renderLoading() : renderError();
    }
    return products.length > 0
      ? renderProductGrid(products)
      : renderNoProducts();
  };

  return (
    <main
      className="min-h-screen dottedBackground py-12 relative"
      id="store"
      role="main"
    >
      <div className="max-w-[115rem] mx-auto px-4 lg:px-3 2xl:px-2">
        <header>
          <h1 className="text-4xl font-bold mb-8 transition-[padding] text-[--text_light_50] text-center">
            {LANGUAGE.STORE.TITLE[preferences.language]}
          </h1>
        </header>

        <section className="flex" aria-label="Products section">
          <div className="flex-1 transition-all duration-300">
            {renderContent()}
          </div>
        </section>
      </div>
    </main>
  );
}
