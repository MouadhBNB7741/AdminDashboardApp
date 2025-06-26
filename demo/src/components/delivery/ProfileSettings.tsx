import React, { useContext, useState } from "react";
import { AuthContext } from "../../context/context";
import { type DeliveryProfile } from "../../types";

interface Props {
  profile: DeliveryProfile;
  setProfile: React.Dispatch<React.SetStateAction<DeliveryProfile>>;
}

export default function ProfileSettings({ profile, setProfile }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const { user } = useContext(AuthContext);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handleSave = () => {
    alert("Profile updated!");
    setIsEditing(false);
    // Add real save logic here (e.g., API call)
  };

  return (
    <div className="max-w-2xl mx-auto bg-gray-800 p-8 rounded-xl shadow-lg border border-teal-600 transition-all duration-300">
      <h2 className="text-2xl font-bold mb-6 text-center text-teal-400">
        Profile Settings
      </h2>

      {/* Common Fields */}
      <div className="mb-5">
        <label className="block text-gray-400 mb-2">Full Name</label>
        <input
          type="text"
          value={user?.name || "N/A"}
          disabled
          className="w-full bg-gray-700 border border-gray-600 p-3 rounded text-white"
        />
      </div>

      <div className="mb-5">
        <label className="block text-gray-400 mb-2">Date of Birth</label>
        <input
          type="date"
          name="date_of_birth"
          value={profile.date_of_birth || ""}
          onChange={handleChange}
          disabled={!isEditing}
          className="w-full bg-gray-700 border border-gray-600 p-2 rounded text-white"
        />
      </div>

      <div className="mb-5">
        <label className="block text-gray-400 mb-2">Gender</label>
        <select
          name="gender"
          value={profile.gender || ""}
          onChange={handleChange}
          disabled={!isEditing}
          className="w-full bg-gray-700 border border-gray-600 p-2 rounded text-white"
        >
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div className="mb-5">
        <label className="block text-gray-400 mb-2">National ID</label>
        <input
          type="text"
          name="national_id"
          value={profile.national_id || ""}
          onChange={handleChange}
          disabled={!isEditing}
          className="w-full bg-gray-700 border border-gray-600 p-3 rounded text-white"
        />
      </div>

      {/* Delivery-specific Fields */}
      <div className="mb-5">
        <label className="block text-gray-400 mb-2">Vehicle Type</label>
        <input
          type="text"
          name="vehicle_type"
          value={profile.vehicle_type || ""}
          onChange={handleChange}
          disabled={!isEditing}
          className="w-full bg-gray-700 border border-gray-600 p-3 rounded text-white"
        />
      </div>

      <div className="mb-5">
        <label className="block text-gray-400 mb-2">License Plate</label>
        <input
          type="text"
          name="license_plate"
          value={profile.license_plate || ""}
          onChange={handleChange}
          disabled={!isEditing}
          className="w-full bg-gray-700 border border-gray-600 p-3 rounded text-white"
        />
      </div>

      {/* Edit/Save Buttons */}
      {isEditing ? (
        <div className="flex gap-3 mt-6">
          <button
            onClick={handleSave}
            className="bg-teal-600 hover:bg-teal-700 px-6 py-2 rounded w-full transition"
          >
            Save
          </button>
          <button
            onClick={() => setIsEditing(false)}
            className="bg-gray-600 hover:bg-gray-700 px-6 py-2 rounded w-full transition"
          >
            Cancel
          </button>
        </div>
      ) : (
        <button
          onClick={() => setIsEditing(true)}
          className="bg-teal-600 hover:bg-teal-700 px-6 py-2 rounded w-full mt-6 transition"
        >
          Edit Profile
        </button>
      )}
    </div>
  );
}
