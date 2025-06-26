interface StockLevel {
  id: number;
  product: string;
  currentStock: number;
  minStock: number;
}

interface Props {
  stockLevels: StockLevel[];
}

export default function Inventory({ stockLevels }: Props) {
  return (
    <div className="max-w-6xl mx-auto px-4">
      <h2 className="text-2xl font-semibold mb-6 text-center text-teal-400">
        Inventory Levels
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {stockLevels.map((item) => (
          <div
            key={item.id}
            className="bg-gray-800 p-5 rounded-lg shadow border border-teal-600 hover:shadow-teal-500/20 transition"
          >
            <h3 className="font-bold">{item.product}</h3>
            <p className="mt-2">
              Current Stock: <strong>{item.currentStock}</strong>
            </p>
            <p>Min Stock: {item.minStock}</p>
            <p
              className={`mt-2 font-semibold ${
                item.currentStock < item.minStock
                  ? "text-yellow-400"
                  : "text-green-400"
              }`}
            >
              {item.currentStock < item.minStock
                ? "⚠️ Low Stock"
                : "✅ In Stock"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
