import React from "react";
import { useNavigate } from "react-router-dom";

const Header: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    navigate("/login");
  };

  return (
    <div className="d-flex justify-content-between align-items-center px-3 py-2 border-bottom bg-white shadow-sm">
      <h5 className="m-0 fw-bold">HRM Dashboard</h5>

      <button className="btn btn-outline-danger btn-sm" onClick={handleLogout}>
        Đăng xuất
      </button>
    </div>
  );
};

export default Header;
