import { type Dispatch, type SetStateAction } from "react";

interface Delivery {
  id: number | string;
  order_id: number | string;
  customer_name: string;
  destination: string;
  status: "pending" | "in-progress" | "delivered";
  payment_status: "paid" | "unpaid";
}

interface Props {
  deliveries: Delivery[];
  selectedDeliveries: Set<string>;
  takenDeliveries: Set<string>;
  setSelectedDeliveries: Dispatch<SetStateAction<Set<string>>>;
  setTakenDeliveries: Dispatch<SetStateAction<Set<string>>>;
}

export default function DeliveryList({
  deliveries,
  selectedDeliveries,
  setSelectedDeliveries,
  setTakenDeliveries,
  takenDeliveries,
}: Props) {
  const toggleSelect = (id: string) => {
    setSelectedDeliveries((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleTakeSelected = () => {
    setTakenDeliveries((prev) => new Set([...prev, ...selectedDeliveries]));
    setSelectedDeliveries(new Set());
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center text-teal-400">
        Deliveries
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {deliveries.map((delivery) => {
          const id = delivery.id.toString();
          const isPending = delivery.status === "pending";
          const isSelected = selectedDeliveries.has(id);
          const isTaken = takenDeliveries.has(id);

          return (
            <div
              key={delivery.id}
              className={`bg-gray-800 p-5 rounded-lg shadow border ${
                isSelected || isTaken
                  ? "border-green-600 ring-2 ring-green-500"
                  : "border-teal-600"
              } transition hover:shadow-teal-500/20`}
            >
              <div className="flex justify-between items-center">
                <span className="font-bold">{delivery.order_id}</span>
                {isTaken ? (
                  <span className="text-xs bg-green-800 text-green-200 px-2 py-1 rounded-full">
                    TAKEN
                  </span>
                ) : isPending ? (
                  <button
                    onClick={() => toggleSelect(id)}
                    disabled={isTaken}
                    className={`px-3 py-1 text-sm rounded ${
                      isSelected
                        ? "bg-green-700 text-white"
                        : "bg-gray-700 text-gray-200"
                    }`}
                  >
                    {isSelected ? "Selected" : "Select"}
                  </button>
                ) : (
                  <span className="text-xs bg-gray-700 text-gray-400 px-2 py-1 rounded-full">
                    {delivery.status.toUpperCase()}
                  </span>
                )}
              </div>

              <p className="mt-2 text-sm text-gray-400">
                Customer: {delivery.customer_name}
              </p>
              <p className="text-sm text-gray-400">
                Destination: {delivery.destination}
              </p>

              <p className="mt-2">
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    delivery.payment_status === "paid"
                      ? "bg-green-800 text-green-200"
                      : "bg-yellow-800 text-yellow-200"
                  }`}
                >
                  {delivery.payment_status.toUpperCase()}
                </span>
              </p>

              <p className="mt-2">
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    delivery.status === "delivered"
                      ? "bg-green-800 text-green-200"
                      : delivery.status === "in-progress"
                      ? "bg-blue-800 text-blue-200"
                      : "bg-yellow-800 text-yellow-200"
                  }`}
                >
                  {delivery.status.toUpperCase()}
                </span>
              </p>
            </div>
          );
        })}
      </div>

      {/* Action Button */}
      {selectedDeliveries.size > 0 && (
        <div className="mt-6 text-right">
          <button
            onClick={handleTakeSelected}
            className="bg-teal-600 hover:bg-teal-700 px-6 py-2 rounded text-white font-semibold transition"
          >
            Take Selected Deliveries
          </button>
        </div>
      )}

      {/* Message when no selections */}
      {selectedDeliveries.size === 0 &&
        takenDeliveries.size === 0 &&
        deliveries.filter((d) => d.status === "pending").length > 0 && (
          <p className="text-gray-400 text-center mt-6">
            Select pending deliveries to take them.
          </p>
        )}

      {/* Message when all done */}
      {takenDeliveries.size > 0 &&
        deliveries.every((d) => takenDeliveries.has(d.id.toString())) && (
          <p className="text-green-400 text-center mt-6">
            All available deliveries have been taken.
          </p>
        )}
    </div>
  );
}
