import { ReactNode } from "react";

interface PriceRange {
  min: number;
  max: number;
}

interface PriceRangeFilterProps {
  onChange: (range: PriceRange) => void;
  value: PriceRange;
  icon: ReactNode;
}

export function PriceRangeFilter({
  icon,
  onChange,
  value,
}: PriceRangeFilterProps) {
  return (
    <div className="flex gap-4">
      <div className="flex align-center flex-row gap-1 w-14">
        {icon}
        <span>Price</span>
      </div>
      <div className="relative">
        <label className="absolute top-left-align-name back-white text-sm text-gray-700 mb-1">
          Min
        </label>
        <input
          type="number"
          min="0"
          value={value.min}
          onChange={(e) => onChange({ ...value, min: Number(e.target.value) })}
          className="px-3 py-2 border border-gray-300 w-52 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>
      <div className="relative">
        <label className="absolute top-left-align-name back-white text-sm text-gray-700 mb-1">
          Max
        </label>
        <input
          type="number"
          min="0"
          value={value.max}
          onChange={(e) => onChange({ ...value, max: Number(e.target.value) })}
          className="px-3 py-2 border border-gray-300 w-52 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>
    </div>
  );
}
