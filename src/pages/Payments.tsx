import { useCart } from "../hooks/useCart";
import { PaymentCard } from "../components/Payment";
import { useId } from "react";

export default function Payments() {
  const { payments } = useCart();
  const paysId = useId();

  return (
    <div className="md:col-span-3">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6">My Payments</h2>
        <div key={paysId} className="flex flex-col gap-4">
          {payments.length == 0 ? (
            <>
              <p className="text-xl flex justify-center">
                You don't have any payment yet
              </p>
            </>
          ) : (
            payments.map((pay) => (
              <PaymentCard
                key={"py-" + pay.id + paysId}
                payment={pay}
              ></PaymentCard>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
