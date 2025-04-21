import { CheckCircle, CircleDashed } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { usePreferences } from "../hooks/usePreferences";
import { BRANDNAME, LANGUAGE } from "../consts";
import { createDateTextFromLanguage, getUrlParam } from "../utils";
import { getPaymentRequest } from "../Api/payment.ts";
import { CartProduct } from "../types/index.ts";

interface PaymentResponseData {
  state: string;
  cart: CartProduct[];
  created_at: string;
  price: string;
}

export default function PaymentSuccess() {
  const { preferences } = usePreferences();
  const [loadingPayment, setLoadingPayment] = useState(true);

  const [paymentDetails, setPaymentDetails] = useState<{
    cart: CartProduct[];
    orderCode: string;
    date: string;
    price: string;
    referenceId: string;
  }>({
    cart: [],
    orderCode: "",
    date: "",
    price: "",
    referenceId: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    const getPaymentInfo = async () => {
      const referenceId = getUrlParam("reference");
      const bankOrder = getUrlParam("bankOrderCode");

      if (!referenceId || !bankOrder) {
        console.log("Missing required URL parameters");
        return navigate("/");
      }

      try {
        const response = await getPaymentRequest(referenceId);
        if (!response) {
          console.log("No response from payment API");
          return navigate("/");
        }

        if (response.status !== 200) {
          console.log("Payment status not 200, going to home", response);
          return navigate("/");
        }

        const paymentData = response.data as PaymentResponseData;

        if (paymentData.state === "0") {
          return navigate(
            `/payment/failed?bankOrderCode=${bankOrder}&reference=${referenceId}`
          );
        }

        setPaymentDetails({
          cart: paymentData.cart,
          orderCode: bankOrder,
          date: paymentData.created_at,
          price: paymentData.price,
          referenceId: referenceId,
        });

        setLoadingPayment(false);
      } catch (error) {
        console.log("Error fetching payment: ", error);
        return navigate("/");
      }
    };
    getPaymentInfo();
  }, []);

  return (
    <main className="min-h-screen-minus-64 bg-[--bg_prim] py-12 ">
      <article className="max-w-7xl mx-auto px-4">
        <section className="max-w-3xl mx-auto">
          <div className={`bg-[--bg_sec] rounded-lg shadow-md p-8`}>
            {loadingPayment ? (
              <div className="flex justify-center items-center gap-3 py-11">
                <CircleDashed className="h-16 w-16 loader text-[--text_light_0]" />
                <span className="text-4xl text-[--text_light_0]">
                  Loading...
                </span>
              </div>
            ) : (
              <div className="payment-success-content">
                <header className="text-center mb-10">
                  <h1 className="text-5xl font-bold flex justify-center items-center gap-3">
                    <CheckCircle className="h-20 w-20 text-[--good]" />
                    <span className="text-[--text_light_0]">
                      {LANGUAGE.PAY_SUCCESS.TITLE[preferences.language]}
                    </span>
                  </h1>
                </header>

                <section className="confirmation-message mb-10">
                  <p className="text-lg text-[--text_light_0] mb-6">
                    {LANGUAGE.PAY_SUCCESS.TEXT1[preferences.language]}
                  </p>
                  <p className="text-lg text-[--text_light_0] mb-6">
                    {LANGUAGE.PAY_SUCCESS.TEXT2[preferences.language]}
                  </p>
                  <p className="text-lg font-bold text-[--text_light_0] mb-6">
                    {LANGUAGE.PAY_SUCCESS.TEXT3[preferences.language]}
                  </p>
                  <p className="text-lg text-[--text_light_0]">
                    {LANGUAGE.PAY_SUCCESS.GREETINGS[preferences.language]}
                  </p>
                  <p className="text-lg font-bold text-[--text_light_0] mb-10">
                    {BRANDNAME}.
                  </p>
                </section>

                <nav className="flex flex-col sm:flex-row gap-4 mb-10">
                  <Link
                    to="/"
                    className="w-full inline-flex justify-center items-center px-6 py-3 border border-transparent text-2xl font-medium rounded-md text-[--text_light_900] bg-[--button] hover:bg-[--button_hover] transition-colors duration-200"
                    onClick={() => window.scrollTo({ top: 0 })}
                  >
                    {LANGUAGE.PAY_SUCCESS.HOME[preferences.language]}
                  </Link>
                  <Link
                    to="/dashboard"
                    className="w-full inline-flex justify-center items-center px-6 py-3 border border-transparent text-2xl font-medium rounded-md text-[--text_light_900] bg-[--button] hover:bg-[--button_hover] transition-colors duration-200"
                    onClick={() => window.scrollTo({ top: 0 })}
                  >
                    {LANGUAGE.PAY_SUCCESS.DASHBOARD[preferences.language]}
                  </Link>
                </nav>

                <section className="payment-details bg-[--bg_prim] p-5 rounded-md">
                  <h2 className="text-xl text-[--text_light_0] font-semibold mb-4">
                    {LANGUAGE.PAY_SUCCESS.DETAILS[preferences.language]}
                  </h2>

                  <div className="products-section">
                    <h3 className="text-lg font-medium text-[--text_light_0]">
                      {LANGUAGE.PAY_SUCCESS.PRODUCTS[preferences.language]}
                    </h3>
                  </div>

                  <ul className="product-list border-t border-b border-[--border_light_400] py-4 my-3">
                    {paymentDetails.cart.map((product) => (
                      <li
                        key={`product-${product.id}`}
                        className="flex justify-between items-center"
                      >
                        <h4 className="font-medium text-[--text_light_0]">
                          {product.title}
                        </h4>
                        <span className="font-semibold text-[--text_light_0]">
                          ${product[product.license]}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <dl className="payment-summary">
                    <div className="flex justify-between items-center mb-3">
                      <dt className="text-lg font-medium text-[--text_light_0]">
                        {LANGUAGE.PAY_SUCCESS.AMOUNT[preferences.language]}
                      </dt>
                      <dd className="font-semibold text-[--text_light_0]">
                        ${paymentDetails.price}
                      </dd>
                    </div>

                    <div className="flex flex-col sm:flex-row items-start justify-between sm:items-center mb-3">
                      <dt className="text-md sm:text-lg font-medium text-[--text_light_0]">
                        {LANGUAGE.PAY_SUCCESS.ORDER[preferences.language]}
                      </dt>
                      <dd className="font-semibold text-sm sm:text-lg text-[--text_light_0]">
                        {paymentDetails.orderCode}
                      </dd>
                    </div>

                    <div className="flex flex-col sm:flex-row items-start justify-between sm:items-center mb-3">
                      <dt className="text-md sm:text-lg font-medium text-[--text_light_0]">
                        {LANGUAGE.PAY_SUCCESS.PAY_ID[preferences.language]}
                      </dt>
                      <dd className="font-semibold text-sm sm:text-lg text-[--text_light_0]">
                        {paymentDetails.referenceId}
                      </dd>
                    </div>

                    <div className="flex flex-col sm:flex-row items-start justify-between sm:items-center mb-3">
                      <dt className="text-md sm:text-lg font-medium text-[--text_light_0]">
                        {LANGUAGE.PAY_SUCCESS.DATE[preferences.language]}
                      </dt>
                      <dd className="font-semibold text-sm sm:text-lg text-[--text_light_0]">
                        {createDateTextFromLanguage(
                          preferences.language,
                          new Date(paymentDetails.date)
                        )}
                      </dd>
                    </div>
                  </dl>
                </section>
              </div>
            )}
          </div>
        </section>
      </article>
    </main>
  );
}
