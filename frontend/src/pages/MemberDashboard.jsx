import React from "react";
import Navbar from "../components/adminAndManager/Navbar";
import { Outlet } from "react-router-dom";
import MemberSidebar from "../components/memberDashboard/MemberSidebar";

const MemberDashboard = () => {
  return (
    <div className="flex">
        < MemberSidebar />
      <div className="flex-1 ml-64 bg-gray-100 h-screen w-full">
        <Navbar />
        <Outlet />
      </div>
    </div>
  );
}

export default MemberDashboard;