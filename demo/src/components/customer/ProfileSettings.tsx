import React, { useState } from "react";
import { type CustomerProfile } from "../../types";

interface Props {
  profile: CustomerProfile;
  setProfile: React.Dispatch<React.SetStateAction<CustomerProfile>>;
}

export default function ProfileSettings({ profile, setProfile }: Props) {
  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handleSave = () => {
    alert("Profile updated!");
    setIsEditing(false);
  };

  return (
    <div className="max-w-md mx-auto bg-gray-800 p-6 rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Profile Settings</h2>

      {/* User ID (Read-only) */}
      <div className="mb-4">
        <label className="block text-gray-400 mb-1">User ID</label>
        <input
          type="text"
          value={profile.id}
          disabled
          className="w-full bg-gray-700 border border-gray-600 p-2 rounded text-white"
        />
      </div>

      {/* Name */}
      <div className="mb-4">
        <label className="block text-gray-400 mb-1">Full Name</label>
        <input
          type="text"
          name="name"
          value={profile.id}
          disabled
          className="w-full bg-gray-700 border border-gray-600 p-2 rounded text-white"
        />
      </div>

      {/* Date of Birth */}
      <div className="mb-4">
        <label className="block text-gray-400 mb-1">Date of Birth</label>
        <input
          type="date"
          name="date_of_birth"
          value={profile.date_of_birth || ""}
          onChange={handleChange}
          disabled={!isEditing}
          className="w-full bg-gray-700 border border-gray-600 p-2 rounded text-white"
        />
      </div>

      {/* Gender */}
      <div className="mb-4">
        <label className="block text-gray-400 mb-1">Gender</label>
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

      {/* National ID */}
      <div className="mb-4">
        <label className="block text-gray-400 mb-1">National ID</label>
        <input
          type="text"
          name="national_id"
          value={profile.national_id || ""}
          onChange={handleChange}
          disabled={!isEditing}
          className="w-full bg-gray-700 border border-gray-600 p-2 rounded text-white"
        />
      </div>

      {/* Profession */}
      <div className="mb-4">
        <label className="block text-gray-400 mb-1">Profession</label>
        <input
          type="text"
          name="profession"
          value={profile.profession || ""}
          onChange={handleChange}
          disabled={!isEditing}
          className="w-full bg-gray-700 border border-gray-600 p-2 rounded text-white"
        />
      </div>

      {/* Medical License */}
      <div className="mb-4">
        <label className="block text-gray-400 mb-1">Medical License</label>
        <input
          type="text"
          name="medical_license"
          value={profile.medical_license || ""}
          onChange={handleChange}
          disabled={!isEditing}
          className="w-full bg-gray-700 border border-gray-600 p-2 rounded text-white"
        />
      </div>

      {/* Organization Name */}
      <div className="mb-4">
        <label className="block text-gray-400 mb-1">Organization Name</label>
        <input
          type="text"
          name="organization_name"
          value={profile.organization_name || ""}
          onChange={handleChange}
          disabled={!isEditing}
          className="w-full bg-gray-700 border border-gray-600 p-2 rounded text-white"
        />
      </div>

      {/* Organization Type */}
      <div className="mb-4">
        <label className="block text-gray-400 mb-1">Organization Type</label>
        <select
          name="organization_type"
          value={profile.organization_type || ""}
          onChange={handleChange}
          disabled={!isEditing}
          className="w-full bg-gray-700 border border-gray-600 p-2 rounded text-white"
        >
          <option value="">Select Type</option>
          <option value="hospital">Hospital</option>
          <option value="clinic">Clinic</option>
          <option value="pharmacy">Pharmacy</option>
          <option value="individual">Individual</option>
        </select>
      </div>

      {/* Buttons */}
      {isEditing ? (
        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleSave}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
          >
            Save
          </button>
          <button
            type="button"
            onClick={() => setIsEditing(false)}
            className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded"
          >
            Cancel
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setIsEditing(true)}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
        >
          Edit Profile
        </button>
      )}
    </div>
  );
}
