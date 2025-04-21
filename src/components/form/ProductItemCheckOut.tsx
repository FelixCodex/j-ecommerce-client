import { LANGUAGE } from "../../consts";
import { CartProduct, Preferences } from "../../types";

export function ProductItemCheckOut({
  product,
  rate,
  preferences,
  CId,
}: {
  product: CartProduct;
  rate: number;
  preferences: Preferences;
  CId: string;
}) {
  return (
    <div
      key={"chr-" + product.id + CId}
      className="flex justify-between items-center"
    >
      <div key={"chr-0" + product.id + CId}>
        <h3 className="font-medium text-[--text_light_300]">{product.title}</h3>
      </div>
      <span
        key={"chr-1" + product.id + CId}
        className="font-semibold text-[--text_light_300]"
      >
        {LANGUAGE.CURRENCIES[preferences.currency]}
        {(preferences.currency == "USD"
          ? product[product.license] / rate
          : product[product.license]
        ).toFixed(2)}
      </span>
    </div>
  );
}
