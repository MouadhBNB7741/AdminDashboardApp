interface Order {
  id: number | string;
  date: string;
  items: string[];
  total: number;
}

interface Props {
  orders: Order[];
}

export default function OrderHistory({ orders }: Props) {
  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-4">Order History</h2>
      {orders.length === 0 ? (
        <p className="text-gray-400">No orders yet.</p>
      ) : (
        orders.map((order, idx) => (
          <div key={idx} className="bg-gray-800 p-4 rounded-lg mb-4">
            <div className="flex justify-between">
              <span className="font-semibold">{order.id}</span>
              <span className="bg-yellow-800 text-yellow-200 px-2 py-1 rounded text-xs">
                Processing
              </span>
            </div>
            <p className="text-sm text-gray-400 mt-1">Date: {order.date}</p>
            <ul className="mt-2 list-disc list-inside text-sm text-gray-300">
              {order.items.map((item: string, i: number) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
            <p className="mt-2 font-bold text-blue-400">
              {order.total.toFixed(2)} DZD
            </p>
          </div>
        ))
      )}
    </div>
  );
}
