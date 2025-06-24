import React from "react";
import { type Product } from "../../types";

interface Props {
  cart: { product: Product; quantity: number }[];
  setCart: React.Dispatch<
    React.SetStateAction<{ product: Product; quantity: number }[]>
  >;
  increaseQuantity: (productId: number) => void;
  decreaseQuantity: (productId: number) => void;
  removeFromCart: (productId: number) => void;
  checkout: () => void;
}

export default function CartSummary({
  cart,
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
  checkout,
}: Props) {
  const cartTotal = cart.reduce(
    (sum, item) => sum + (item.product.price || 0) * item.quantity,
    0
  );

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center text-teal-400">
        Your Cart
      </h2>

      {cart.length === 0 ? (
        <p className="text-gray-400 text-center py-6">No items in cart.</p>
      ) : (
        <>
          <ul className="space-y-4">
            {cart.map(({ product, quantity }) => (
              <li
                key={product.id}
                className="flex items-center justify-between bg-gray-800 p-4 rounded-lg shadow border border-teal-600"
              >
                <div className="flex items-center space-x-4">
                  <img
                    src={product.image}
                    alt={product.name_en}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div>
                    <h4 className="font-semibold">{product.name_en}</h4>
                    <p className="text-sm text-gray-400">
                      {product.price?.toFixed(2)} DZD
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => decreaseQuantity(product.id)}
                    className="px-3 py-1 bg-gray-700 rounded hover:bg-gray-600"
                  >
                    -
                  </button>
                  <span className="text-lg font-medium">{quantity}</span>
                  <button
                    onClick={() => increaseQuantity(product.id)}
                    className="px-3 py-1 bg-gray-700 rounded hover:bg-gray-600"
                  >
                    +
                  </button>
                  <button
                    onClick={() => removeFromCart(product.id)}
                    className="ml-2 text-red-400 hover:text-red-300"
                  >
                    🗑️
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-8 text-right">
            <p className="text-xl font-bold text-teal-400">
              Total: {cartTotal.toFixed(2)} DZD
            </p>
            <button
              onClick={checkout}
              className="mt-4 w-full bg-green-600 hover:bg-green-700 py-3 rounded text-white font-semibold transition"
            >
              Place Order
            </button>
          </div>
        </>
      )}
    </div>
  );
}
