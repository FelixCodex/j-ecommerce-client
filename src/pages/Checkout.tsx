import { useEffect, useState } from "react";
import { useCart } from "../hooks/useCart";
import { COUNTRIES, LANGUAGE } from "../consts";
import { usePreferences } from "../hooks/usePreferences";
import { InputTextCheckOut } from "../components/form/InputTextCheckOut";
import { InputSelectPhone } from "../components/form/InputSelectPhone";
import { InputCountry } from "../components/form/InputCountry";
import { ButtonSubmitCheckOut } from "../components/form/ButtonSubmitCheckOut";
import { ProductItemCheckOut } from "../components/form/ProductItemCheckOut";
import { TropipayLogo } from "../components/Elements/TropipayLogo";
import { VisaLogo } from "../components/Elements/VisaLogo";
import { MasterCardLogo } from "../components/Elements/MasterCardLogo";
import { PaymentSelectorCard } from "../components/PaymentSelectorCard";
import { License, PayMethods, Product } from "../types";
import { paymentLinkRequest as tppPaymentLinkRequest } from "../Api/tpp";
import { quickPaymentLinkRequest as tppQuickPaymentLinkRequest } from "../Api/tpp";
import { useNavigate } from "react-router-dom";
import { getUrlParam } from "../utils";
import { useProduct } from "../hooks/useProduct";

export default function Checkout() {
  const { state: cart, loadCart, loadingCart, purchased, rate } = useCart();
  const [payMethod, setPayMethod] = useState<PayMethods | null>("tpp");
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [requestErrors, setRequestErrors] = useState<string[]>([]);
  const [urlLicense, setUrlLicense] = useState<License | null>(null);
  const [urlProduct, setUrlProduct] = useState<Product | null>(null);
  const { preferences } = usePreferences();
  const { products } = useProduct();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    lastName: "",
    address: "",
    country: 1,
    phoneNumber: "",
    callingCode: "",
    city: "",
    postalCode: "",
  });

  // Update form field handler
  const updateFormField = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Load cart data on component mount
  useEffect(() => {
    loadCart();
  }, []);

  useEffect(() => {
    const pid = getUrlParam("i");
    const pl = getUrlParam("l");
    if (pid) {
      const prod = products?.find((el) => el.id == pid);
      if (prod) {
        const inCart = cart.find((el) => el.id == prod.id);
        const inPurchased = purchased.find((el) => el.id == prod.id);
        if (inCart) {
          navigate(`/cart`);
          return;
        }
        if (inPurchased) {
          navigate(`/dashboard`);
          return;
        }

        if (pl == "personal" || pl == "professional") {
          setUrlProduct(prod);
          setUrlLicense(pl);
          return;
        } else {
          navigate(`/product/${prod.id}`);
          return;
        }
      }
      setUrlProduct(null);
    }
    setUrlProduct(null);
  }, [cart, navigate, products, purchased]);

  // Form submission handler
  const handleTppSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (loadingSubmit) return;
    setLoadingSubmit(true);
    setRequestErrors([]);

    try {
      const {
        name,
        lastName,
        phoneNumber,
        callingCode,
        address,
        city,
        country,
        postalCode,
      } = formData;

      const data = {
        name,
        lastName,
        phoneNumber: `+${callingCode}${phoneNumber}`,
        address,
        city,
        country,
        postalCode,
      };

      let res = await tppPaymentLinkRequest(data);

      if (urlProduct) {
        if (urlLicense == "personal" || urlLicense == "professional") {
          res = await tppQuickPaymentLinkRequest({
            ...data,
            productId: urlProduct.id,
            license: urlLicense,
          });
        } else {
          throw new Error("License not valid or selected");
        }
      } else {
        res = await tppPaymentLinkRequest(data);
      }

      if (!res) throw new Error("Error while creating payment");
      if (res.data.error) throw new Error(res.data.error[0]);

      if (res.status === 200) {
        window.location.href = res.data.paymentlink;
        return;
      }
    } catch (error) {
      console.error("Payment submission error:", error);
      setRequestErrors([
        "Something went wrong with your payment. Please try again.",
      ]);
    } finally {
      setLoadingSubmit(false);
    }
  };

  const renderItems = () => {
    if (urlProduct) {
      return (
        <ul aria-label="Items">
          <li key={`product-${21}`} className="list-none">
            <ProductItemCheckOut
              product={{
                ...urlProduct,
                license: urlLicense ? urlLicense : "personal",
              }}
              preferences={preferences}
              rate={rate}
              CId={`item-${21}`}
            />
          </li>
        </ul>
      );
    }
    return cart.length > 0 ? (
      <ul aria-label="Cart items">
        {cart.map((prod, index) => (
          <li key={`product-${index}`} className="list-none">
            <ProductItemCheckOut
              product={prod}
              preferences={preferences}
              rate={rate}
              CId={`item-${index}`}
            />
          </li>
        ))}
      </ul>
    ) : (
      <p className="text-xl text-[--text_light_100]">
        {LANGUAGE.CHECKOUT.ANY[preferences.language]}
      </p>
    );
  };

  const renderTotal = () => {
    if (urlProduct) {
      if (urlLicense == "personal" || urlLicense == "professional") {
        return preferences.currency == "USD"
          ? urlProduct[urlLicense] / rate
          : urlProduct[urlLicense];
      }
      return 0;
    }
    return cart.reduce(
      (sum, item) =>
        sum +
        (preferences.currency == "USD"
          ? item[item.license] / rate
          : item[item.license]),
      0
    );
  };

  const isFormDisabled = urlProduct
    ? loadingSubmit
    : loadingCart || loadingSubmit || cart.length === 0;
  const isSubmitDisabled = isFormDisabled || payMethod === null;

  return (
    <main className="min-h-screen-minus-64 dottedBackground py-12">
      <div className="max-w-7xl mx-auto px-4">
        <section className="max-w-full mx-auto mb-10">
          <div className="bg-[--bg_sec] md:dark:bg-transparent md:bg-transparent rounded-lg">
            <div className="flex flex-col md:flex-row-reverse md:justify-center md:gap-3 shadow-md md:shadow-none p-6 md:p-0">
              <div className="w-full flex flex-col md:flex-row-reverse md:justify-center md:gap-3">
                {/* Order Summary Section */}
                <aside className="md:bg-[--bg_sec] md:p-6 md:rounded-lg md:shadow-md w-full md:max-w-80 lg:max-w-[22.5rem] flex flex-col max-h-full h-fit mb-6 md:!mb-0">
                  <h1 className="text-2xl font-bold text-[--text_light_0] mb-8">
                    {LANGUAGE.CHECKOUT.TITLE[preferences.language]}
                  </h1>

                  <div>
                    <h2 className="text-xl font-bold text-[--text_light_100] mb-4">
                      {LANGUAGE.CHECKOUT.SUMMARY[preferences.language]}
                    </h2>
                    <div className="border-t border-b border-[--border_light_400] py-4">
                      <div className="max-h-full px-1 overflow-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-[--bg_light_700] [&::-webkit-scrollbar-thumb]:rounded-md">
                        {renderItems()}
                      </div>
                    </div>
                    <div className="flex flex-col mt-4">
                      <div className="font-bold text-lg flex justify-between text-[--text_light_100]">
                        <span>
                          {LANGUAGE.CHECKOUT.TOTAL[preferences.language]}
                        </span>
                        <span className="font-bold text-xl text-[--text_light_100]">
                          ${renderTotal().toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Desktop error messages */}
                  {requestErrors.length > 0 && (
                    <div
                      className="hidden md:flex flex-col items-start justify-center mt-2"
                      role="alert"
                      aria-live="assertive"
                    >
                      {requestErrors.map((error, index) => (
                        <span
                          key={`desktop-error-${index}`}
                          className="text-xl text-red-500"
                        >
                          {error}
                        </span>
                      ))}
                    </div>
                  )}

                  <ButtonSubmitCheckOut
                    hideInMoblie
                    type="submit"
                    form={payMethod ?? undefined}
                    loadingSubmit={loadingSubmit}
                    loading={isSubmitDisabled}
                    disabled={isSubmitDisabled}
                    text={LANGUAGE.CHECKOUT.PAY[preferences.language]}
                  />
                </aside>

                {/* Payment Form Section */}
                <section className="md:bg-[--bg_sec] md:p-6 md:rounded-lg md:shadow-md w-full max-w-2xl flex flex-col gap-3">
                  <h2 className="text-[--text_light_0] text-xl font-bold">
                    {LANGUAGE.CHECKOUT.PAYMENT_METHODS[preferences.language]}
                  </h2>

                  <PaymentSelectorCard
                    id="tpp"
                    title="Pay With Tropipay"
                    payMethod={payMethod}
                    setPayMethod={setPayMethod}
                    icon={
                      <TropipayLogo className="h-9 w-9" aria-hidden="true" />
                    }
                    childrenIcon={
                      <>
                        <VisaLogo className="h-9 w-9" aria-hidden="true" />
                        <MasterCardLogo
                          className="h-9 w-9"
                          aria-hidden="true"
                        />
                      </>
                    }
                    gap={"0.62rem"}
                    formHidden={false}
                    formLabelTitle={
                      LANGUAGE.CHECKOUT.PAYMENT_INFORMATION[
                        preferences.language
                      ]
                    }
                    formChildren={
                      <>
                        <InputTextCheckOut
                          label={LANGUAGE.CHECKOUT.NAME[preferences.language]}
                          id="name"
                          name="name"
                          required
                          type="text"
                          value={formData.name}
                          setValue={(value) => updateFormField("name", value)}
                          disabled={isFormDisabled}
                        />
                        <InputTextCheckOut
                          label={
                            LANGUAGE.CHECKOUT.LASTNAME[preferences.language]
                          }
                          id="lastname"
                          name="lastname"
                          required
                          type="text"
                          value={formData.lastName}
                          setValue={(value) =>
                            updateFormField("lastName", value)
                          }
                          disabled={isFormDisabled}
                        />
                        <InputSelectPhone
                          label={LANGUAGE.CHECKOUT.PHONE[preferences.language]}
                          id="phone"
                          name="phone"
                          required
                          value={formData.phoneNumber}
                          setValue={(value) =>
                            updateFormField("phoneNumber", value)
                          }
                          setCallingCode={(value) =>
                            updateFormField("callingCode", value)
                          }
                          disabled={isFormDisabled}
                          countries={
                            COUNTRIES as {
                              id: number;
                              slug: string;
                              callingCode: number;
                            }[]
                          }
                        />
                        <InputTextCheckOut
                          label={
                            LANGUAGE.CHECKOUT.ADDRESS[preferences.language]
                          }
                          id="address"
                          name="address"
                          required
                          type="text"
                          value={formData.address}
                          setValue={(value) =>
                            updateFormField("address", value)
                          }
                          disabled={isFormDisabled}
                        />
                        <InputCountry
                          label={
                            LANGUAGE.CHECKOUT.COUNTRY[preferences.language]
                          }
                          id="country"
                          name="country"
                          required
                          value={formData.country}
                          setValue={(value) =>
                            updateFormField("country", value)
                          }
                          disabled={isFormDisabled}
                          countries={
                            COUNTRIES as { id: number; name: string }[]
                          }
                        />
                        <div className="grid grid-cols-2 gap-4">
                          <InputTextCheckOut
                            label={LANGUAGE.CHECKOUT.CITY[preferences.language]}
                            id="city"
                            name="city"
                            required
                            type="text"
                            value={formData.city}
                            setValue={(value) => updateFormField("city", value)}
                            disabled={isFormDisabled}
                          />
                          <InputTextCheckOut
                            label={
                              LANGUAGE.CHECKOUT.POSTALCODE[preferences.language]
                            }
                            id="postalCode"
                            name="postalCode"
                            required
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            value={formData.postalCode}
                            setValue={(value) =>
                              updateFormField("postalCode", value)
                            }
                            disabled={isFormDisabled}
                          />
                        </div>
                      </>
                    }
                    handleSubmit={handleTppSubmit}
                  />

                  {/* Mobile error messages */}
                  {requestErrors.length > 0 && (
                    <div
                      className="flex md:!hidden flex-col items-start justify-center mt-2"
                      role="alert"
                      aria-live="assertive"
                    >
                      {requestErrors.map((error, index) => (
                        <span
                          key={`mobile-error-${index}`}
                          className="text-xl text-red-500"
                        >
                          {error}
                        </span>
                      ))}
                    </div>
                  )}

                  <ButtonSubmitCheckOut
                    hideInMoblie={false}
                    type="submit"
                    form={payMethod ?? undefined}
                    loadingSubmit={loadingSubmit}
                    loading={isSubmitDisabled}
                    disabled={isSubmitDisabled}
                    text={LANGUAGE.CHECKOUT.PAY[preferences.language]}
                  />
                </section>
              </div>
            </div>
          </div>
          <footer className="flex mt-4 items-center justify-center">
            <p className="text-sm text-[--text_light_200] px-3">
              {LANGUAGE.CHECKOUT.TERMS_AND_CONDITIONS[preferences.language]}
            </p>
          </footer>
        </section>
      </div>
    </main>
  );
}
