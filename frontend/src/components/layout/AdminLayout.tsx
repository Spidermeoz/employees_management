import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";

const AdminLayout: React.FC = () => {
  return (
    <div className="d-flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Content Area */}
      <div className="flex-grow-1" style={{ marginLeft: "250px" }}>
        <Header />

        <main className="p-3" style={{ minHeight: "100vh" }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
