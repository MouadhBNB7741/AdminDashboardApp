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
      <h2 className="text-xl font-semibold mb-4">Your Cart</h2>
      {cart.length === 0 ? (
        <p className="text-gray-400">No items in cart.</p>
      ) : (
        <>
          <ul className="space-y-4">
            {cart.map(({ product, quantity }) => (
              <li
                key={product.id}
                className="flex items-center justify-between bg-gray-800 p-4 rounded"
              >
                <div className="flex items-center space-x-4">
                  <img
                    src={product.image}
                    alt={product.name_en}
                    className="w-12 h-12 object-cover rounded"
                  />
                  <div>
                    <h4>{product.name_en}</h4>
                    <p className="text-sm text-gray-400">
                      {product.price?.toFixed(2)} DZD
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => decreaseQuantity(product.id)}
                    className="px-2 py-1 bg-gray-700 rounded"
                  >
                    -
                  </button>
                  <span>{quantity}</span>
                  <button
                    onClick={() => increaseQuantity(product.id)}
                    className="px-2 py-1 bg-gray-700 rounded"
                  >
                    +
                  </button>
                  <button
                    onClick={() => removeFromCart(product.id)}
                    className="ml-2 text-red-400"
                  >
                    🗑️
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-6 text-right">
            <p className="text-lg font-bold">
              Total: {cartTotal.toFixed(2)} DZD
            </p>
            <button
              onClick={checkout}
              className="mt-2 w-full bg-green-600 hover:bg-green-700 py-2 rounded text-white"
            >
              Place Order
            </button>
          </div>
        </>
      )}
    </div>
  );
}
