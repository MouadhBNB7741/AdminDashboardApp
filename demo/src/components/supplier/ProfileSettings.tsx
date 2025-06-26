import React, { useState } from "react";

interface SupplierProfile {
  id: number;
  businessName: string;
  contactEmail: string;
  phone: string;
  address: string;
  licenseNumber: string;
}

interface Props {
  profile: SupplierProfile;
  setProfile: React.Dispatch<React.SetStateAction<SupplierProfile>>;
}

export default function ProfileSettings({ profile, setProfile }: Props) {
  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    alert("Profile updated!");
    setIsEditing(false);
  };

  return (
    <div className="max-w-2xl mx-auto bg-gray-800 p-8 rounded-xl shadow-lg border border-teal-600 transition-all duration-300">
      <h2 className="text-2xl font-bold mb-6 text-center text-teal-400">
        Profile Settings
      </h2>

      <div className="space-y-4">
        <div>
          <label className="block text-gray-400 mb-2">Business Name</label>
          <input
            name="businessName"
            value={profile.businessName}
            onChange={handleChange}
            disabled={!isEditing}
            className="w-full bg-gray-700 border border-gray-600 p-3 rounded text-white"
          />
        </div>
        <div>
          <label className="block text-gray-400 mb-2">Contact Email</label>
          <input
            name="contactEmail"
            value={profile.contactEmail}
            onChange={handleChange}
            disabled={!isEditing}
            className="w-full bg-gray-700 border border-gray-600 p-3 rounded text-white"
          />
        </div>
        <div>
          <label className="block text-gray-400 mb-2">Phone</label>
          <input
            name="phone"
            value={profile.phone}
            onChange={handleChange}
            disabled={!isEditing}
            className="w-full bg-gray-700 border border-gray-600 p-3 rounded text-white"
          />
        </div>
        <div>
          <label className="block text-gray-400 mb-2">Address</label>
          <input
            name="address"
            value={profile.address}
            onChange={handleChange}
            disabled={!isEditing}
            className="w-full bg-gray-700 border border-gray-600 p-3 rounded text-white"
          />
        </div>
        <div>
          <label className="block text-gray-400 mb-2">License Number</label>
          <input
            name="licenseNumber"
            value={profile.licenseNumber}
            onChange={handleChange}
            disabled={!isEditing}
            className="w-full bg-gray-700 border border-gray-600 p-3 rounded text-white"
          />
        </div>
      </div>

      {isEditing ? (
        <div className="flex gap-3 mt-6">
          <button
            onClick={handleSave}
            className="bg-teal-600 hover:bg-teal-700 px-6 py-2 rounded w-full transition"
          >
            Save Changes
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
