import { Link } from "react-router-dom";
import { Payment } from "../types";
import { months } from "../consts";

export function PaymentCard({ payment }: { payment: Payment }) {
  const date = new Date(payment.created_at);
  return (
    <Link
      to={
        payment.state == 1
          ? payment.shortURL
          : payment.state == 2
          ? "/dashboard"
          : "/"
      }
      className={`w-full ${payment.state != 1 && "pointer-events-none"}`}
    >
      <div className="border rounded-lg p-3 flex flex-row justify-between gap-1 shadow">
        <div className="flex flex-col gap-1">
          <p>ID: {payment.id}</p>
          <p className="text-sm">Price: ${payment.price}</p>
        </div>
        <div className="flex flex-col justify-end gap-1">
          <div
            className={`flex justify-center rounded-md ${
              payment.state == 1
                ? "bg-blue-400"
                : payment.state == 2
                ? "bg-green-400"
                : "bg-red-400"
            }`}
          >
            <p>
              {payment.state == 1
                ? "Pending"
                : payment.state == 2
                ? "Completed"
                : "Failed"}
            </p>
          </div>
          <p className="text-sm">{`${
            months[date.getMonth()]
          } ${date.getDate()}, ${date.getFullYear()}`}</p>
        </div>
      </div>
    </Link>
  );
}
