import { useState } from "react";
import { DollarSign, X } from "lucide-react";
import { PriceRangeFilter } from "./PriceRangeFilter";

interface Filters {
  priceRange: {
    min: number;
    max: number;
  };
  category: string;
  star: number;
}

const initialFilters: Filters = {
  priceRange: {
    min: 0,
    max: 0,
  },
  category: "",
  star: 0,
};

interface SearchFiltersProps {
  onFiltersChange: (filters: Filters) => void;
}

export function SearchFilters({ onFiltersChange }: SearchFiltersProps) {
  const [filters, setFilters] = useState<Filters>(initialFilters);

  const handleFilterChange = (key: keyof Filters, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const resetFilters = () => {
    setFilters(initialFilters);
    onFiltersChange(initialFilters);
  };

  const hasActiveFilters =
    filters.priceRange.min > 0 ||
    filters.priceRange.max > 0 ||
    filters.category !== "" ||
    filters.star !== 0;

  return (
    <div className="w-full bg-white shadow-sm rounded-md border-b mb-6">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex flex-wrap gap-4">
          <PriceRangeFilter
            icon={<DollarSign className="h-4 w-4" />}
            value={filters.priceRange}
            onChange={(value) => handleFilterChange("priceRange", value)}
          />

          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              <X className="h-4 w-4" />
              Clear Filters
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
