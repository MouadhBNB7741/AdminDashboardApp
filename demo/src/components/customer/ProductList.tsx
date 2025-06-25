import { useState } from "react";
import { type Product } from "../../types";

interface Props {
  products: Product[];
  addToCart: (product: Product) => void;
}

export default function ProductList({ products, addToCart }: Props) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState<
    "newest" | "oldest" | "low-high" | "high-low"
  >("newest");

  // Sort logic
  const sortedProducts = [...products].sort((a, b) => {
    switch (sortOption) {
      case "oldest":
        return a.id - b.id;
      case "low-high":
        return (a.price || 0) - (b.price || 0);
      case "high-low":
        return (b.price || 0) - (a.price || 0);
      default:
        return b.id - a.id; // newest
    }
  });

  return (
    <div className="space-y-6">
      {/* Search and Sort */}
      <div className="flex flex-wrap gap-4 justify-between items-center">
        <input
          type="text"
          placeholder="Search by product name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 bg-gray-800 border border-gray-600 rounded text-white w-full sm:w-auto"
        />
        <select
          value={sortOption}
          onChange={(e) =>
            setSortOption(
              e.target.value as "newest" | "oldest" | "low-high" | "high-low"
            )
          }
          className="p-2 bg-gray-800 border border-gray-600 rounded text-white"
        >
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="low-high">Price: Low to High</option>
          <option value="high-low">Price: High to Low</option>
        </select>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedProducts
          .filter((product) =>
            product.name_en.toLowerCase().includes(searchTerm.toLowerCase())
          )
          .map((product) => (
            <div
              key={product.id}
              className="bg-gray-800 rounded-lg overflow-hidden shadow-lg transform transition hover:scale-105 hover:shadow-teal-500/20"
            >
              <img
                src={product.image}
                alt={product.name_en}
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold">{product.name_en}</h3>
                <p className="text-sm text-gray-400">
                  {product.short_description_en}
                </p>
                <p className="mt-2 font-bold text-teal-400">
                  {product.price?.toFixed(2)} DZD
                </p>
                <button
                  onClick={() => addToCart(product)}
                  className="mt-3 w-full bg-teal-600 hover:bg-teal-700 py-2 rounded text-white transition"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
