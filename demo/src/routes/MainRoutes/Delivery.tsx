import { useContext, useState } from "react";
import DeliveryNav from "../../components/delivery/DeliveryNav";
import DeliveryList from "../../components/delivery/DeliveryList";
import ProfileSettings from "../../components/delivery/ProfileSettings";
import { AuthContext } from "../../context/context";
import type { DeliveryProfile } from "../../types";

export default function DeliveryDashboard() {
  const [activeTab, setActiveTab] = useState<"deliveries" | "settings">(
    "deliveries"
  );
  const { user } = useContext(AuthContext);

  const [profile, setProfile] = useState<DeliveryProfile>({
    id: 1,
    date_of_birth: "1985-06-15",
    gender: "male",
    national_id: "123456789012345678",
    vehicle_type: "Motorcycle",
    license_plate: "ALG-123-TZ",
    user_id: user!.id,
  });

  const [deliveries] = useState([
    {
      id: 1,
      order_id: "ORD-1001",
      customer_name: "John Doe",
      destination: "Alger, Bab Ezzouar",
      status: "pending" as const,
      payment_status: "paid" as const,
    },
    {
      id: 2,
      order_id: "ORD-1002",
      customer_name: "Sarah Lee",
      destination: "Oran, Ain El Turck",
      status: "in-progress" as const,
      payment_status: "unpaid" as const,
    },
    {
      id: 3,
      order_id: "ORD-1003",
      customer_name: "Ali Benkhaled",
      destination: "Constantine, Centre Ville",
      status: "delivered" as const,
      payment_status: "paid" as const,
    },
  ]);

  const [selectedDeliveries, setSelectedDeliveries] = useState<Set<string>>(
    new Set()
  );
  const [takenDeliveries, setTakenDeliveries] = useState<Set<string>>(
    new Set()
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-950 to-teal-900 text-white flex">
      <DeliveryNav activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 p-4 md:p-8 overflow-auto md:ml-64 bg-gray-900">
        <div className="flex justify-end items-center mb-8">
          <div className="flex items-center gap-3 bg-gray-800 px-4 py-2 rounded-lg shadow-md">
            <span className="bg-teal-500 p-2 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </span>
            <span className="font-semibold">{user!.name}</span>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveTab("settings")}
                className="p-2 rounded-full hover:bg-gray-700 transition"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {activeTab === "deliveries" && (
          <DeliveryList
            deliveries={deliveries}
            selectedDeliveries={selectedDeliveries}
            setSelectedDeliveries={setSelectedDeliveries}
            takenDeliveries={takenDeliveries}
            setTakenDeliveries={setTakenDeliveries}
          />
        )}
        {activeTab === "settings" && (
          <ProfileSettings profile={profile} setProfile={setProfile} />
        )}
      </main>
    </div>
  );
}
