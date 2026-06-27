interface ProductFilterProps {
  categories: Array<{ id: string; name: string }>;
  selectedCategory: string;
  onCategoryChange: (categoryId: string) => void;
  minPrice?: number;
  maxPrice?: number;
  onPriceChange: (min?: number, max?: number) => void;
  inStock: boolean;
  onInStockChange: (inStock: boolean) => void;
  sortBy: string;
  onSortChange: (sortBy: string) => void;
}

export default function ProductFilter({
  categories,
  selectedCategory,
  onCategoryChange,
  minPrice,
  maxPrice,
  onPriceChange,
  inStock,
  onInStockChange,
  sortBy,
  onSortChange,
}: ProductFilterProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 h-fit">
      <h3 className="text-lg font-semibold mb-4">Filters</h3>
      
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
        <select
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="w-full border rounded-md px-3 py-2"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
        <div className="flex items-center space-x-2">
          <input
            type="number"
            placeholder="Min"
            value={minPrice ?? ''}
            onChange={(e) => onPriceChange(e.target.value ? Number(e.target.value) : undefined, maxPrice)}
            className="w-full border rounded-md px-3 py-2"
          />
          <span>-</span>
          <input
            type="number"
            placeholder="Max"
            value={maxPrice ?? ''}
            onChange={(e) => onPriceChange(minPrice, e.target.value ? Number(e.target.value) : undefined)}
            className="w-full border rounded-md px-3 py-2"
          />
        </div>
      </div>

      <div className="mb-6">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={inStock}
            onChange={(e) => onInStockChange(e.target.checked)}
            className="mr-2"
          />
          <span className="text-sm text-gray-700">In Stock Only</span>
        </label>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className="w-full border rounded-md px-3 py-2"
        >
          <option value="createdAt-desc">Newest First</option>
          <option value="createdAt-asc">Oldest First</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="name-asc">Name: A to Z</option>
          <option value="name-desc">Name: Z to A</option>
        </select>
      </div>
    </div>
  );
}
