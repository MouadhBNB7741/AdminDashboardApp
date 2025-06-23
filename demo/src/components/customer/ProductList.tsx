import { type Product } from "../../types";

interface Props {
  products: Product[];
  addToCart: (product: Product) => void;
}

export default function ProductList({ products, addToCart }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <div
          key={product.id}
          className="bg-gray-800 rounded-lg overflow-hidden shadow-lg"
        >
          <img
            src={product.image}
            alt={product.name_en}
            className="w-full h-40 object-cover"
          />
          <div className="p-4">
            <h3 className="text-lg font-semibold">{product.name_en}</h3>
            <p className="text-gray-400">{product.short_description_en}</p>
            <p className="mt-2 font-bold text-blue-400">
              {product.price?.toFixed(2)} DZD
            </p>
            <button
              onClick={() => addToCart(product)}
              className="mt-3 w-full bg-blue-600 hover:bg-blue-700 py-2 rounded text-white"
            >
              Add to Cart
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
