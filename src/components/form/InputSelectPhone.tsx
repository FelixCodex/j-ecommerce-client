interface InputInterface {
  label: string;
  id: string;
  name: string;
  disabled: boolean;
  required: boolean;
  value: string;
  setValue: (values: string) => void;
  callingCode: string;
  setCallingCode: (values: string) => void;
  countries: { id: number; slug: string; callingCode: number }[];
}

export function InputSelectPhone({
  label,
  id,
  name,
  required,
  disabled,
  value,
  setValue,
  callingCode,
  setCallingCode,
  countries,
}: InputInterface) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-[--text_light_200] mb-1"
      >
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="flex flex-row">
        <select
          id={id}
          name={name}
          className="w-1/6 min-w-[92px] px-3 py-2 border-t border-l border-b bg-[--bg_prim] border-[--border_light_500] text-[--text_light_0] appearance-none rounded-tl-md rounded-bl-md focus:z-50 focus:outline-none focus:ring-2 focus:ring-[--brand_color]"
          value={callingCode}
          disabled={disabled}
          onChange={(e) => setCallingCode(e.target.value)}
        >
          {countries
            .sort((a, b) => a.slug.localeCompare(b.slug))
            .map((country) => (
              <option
                key={"spnc-chr-" + country.id}
                value={`${country.callingCode}`}
                className="flex justify-between"
              >
                {country.slug} +{country.callingCode}
              </option>
            ))}
        </select>
        <input
          type="number"
          value={value}
          required={required}
          disabled={disabled}
          onChange={(e) => {
            setValue(e.target.value);
          }}
          className={`w-full px-3 py-2 bg-[--bg_prim] border-[--border_light_500] text-[--text_light_0]  [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [appearance:textfield] border rounded-tr-md rounded-br-md  focus:outline-none focus:ring-2 focus:ring-[--brand_color] `}
          placeholder="2125844128"
          maxLength={6}
        />
      </div>
    </div>
  );
}
