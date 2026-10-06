import React from "react";
import { useAuth } from "@/context/AuthContext";

const ProfilePage = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8">
        My Profile
      </h1>

      <div className="bg-white shadow rounded-xl p-6 border">
        <div className="mb-5">
          <p className="text-gray-500">
            Name
          </p>

          <h2 className="text-xl font-semibold">
            {user?.name}
          </h2>
        </div>

        <div className="mb-5">
          <p className="text-gray-500">
            Email
          </p>

          <h2 className="text-xl font-semibold">
            {user?.email}
          </h2>
        </div>

       
      </div>
    </div>
  );
};

export default ProfilePage;