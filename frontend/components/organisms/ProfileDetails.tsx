"use client";
import React from "react";
import useUser from "@/store/sliceHooks/useUser";

const ProfileDetails = () => {
  const { user } = useUser();
  console.log("user", user);
  if (user === null)
    return (
      <div>
        User not already created on chain, it will be created on your first
        contribution
      </div>
    );
  return <div>ProfileDetails</div>;
};

export default ProfileDetails;
