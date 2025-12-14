import React from "react";
import { NavLink } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  FaChartBar,
  FaUsers,
  FaBuilding,
  FaThumbtack,
  FaMoneyBillWave,
  FaFileContract,
  FaClock,
  FaHandHoldingUsd,
  FaAward,
  FaSignOutAlt,
} from "react-icons/fa"; // Import các icon cần thiết

const Sidebar: React.FC = () => {
  // Dữ liệu menu để dễ dàng quản lý
  const menuItems = [
    { path: "/", label: "Dashboard", icon: <FaChartBar size={20} /> },
    { path: "/employees", label: "Nhân viên", icon: <FaUsers size={20} /> },
    { path: "/departments", label: "Phòng ban", icon: <FaBuilding size={20} /> },
    { path: "/positions", label: "Chức vụ", icon: <FaThumbtack size={20} /> },
    { path: "/salary-grades", label: "Bậc lương", icon: <FaMoneyBillWave size={20} /> },
    { path: "/contracts", label: "Hợp đồng", icon: <FaFileContract size={20} /> },
    { path: "/timesheets", label: "Chấm công", icon: <FaClock size={20} /> },
    { path: "/payrolls", label: "Bảng lương", icon: <FaHandHoldingUsd size={20} /> },
    { path: "/rewards", label: "Thưởng / phạt", icon: <FaAward size={20} /> },
  ];

  return (
    <>
      {/* Custom CSS cho sidebar */}
      <style>
        {`
          .sidebar-container {
            background-color: #2c3e50; /* Màu tối hiện đại hơn */
            box-shadow: 2px 0 5px rgba(0,0,0,0.1);
            transition: all 0.3s;
          }
          .sidebar-header {
            padding: 1.5rem 1rem;
            text-align: center;
            border-bottom: 1px solid #34495e;
          }
          .sidebar-header h4 {
            color: #ecf0f1;
            font-weight: 700;
            margin: 0;
          }
          .nav-item-custom {
            color: #bdc3c7;
            padding: 0.9rem 1.2rem;
            border-radius: 5px;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            text-decoration: none;
            margin-bottom: 0.5rem;
          }
          .nav-item-custom:hover {
            background-color: #34495e;
            color: #fff;
            transform: translateX(5px);
          }
          .nav-item-custom.active {
            background-color: #3498db; /* Màu nền khi active */
            color: #fff;
            border-left: 4px solid #fff; /* Đường viền bên trái */
          }
          .nav-item-custom i {
            margin-right: 12px;
            width: 20px;
            text-align: center;
          }
          .user-profile {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            padding: 1rem;
            border-top: 1px solid #34495e;
            text-align: center;
          }
          .user-profile a {
            color: #e74c3c;
            text-decoration: none;
            font-weight: 500;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
          }
          .user-profile a:hover {
            color: #c0392b;
          }
        `}
      </style>

      <div
        className="sidebar-container bg-dark text-white position-fixed h-100 d-flex flex-column"
        style={{ width: "250px" }}
      >
        {/* Header */}
        <div className="sidebar-header">
          <h4>HRM Admin</h4>
        </div>

        {/* Navigation */}
        <nav className="nav flex-column p-3">
          {menuItems.map((item, index) => (
            <NavLink
              key={index}
              to={item.path}
              className={({ isActive }) =>
                "nav-item-custom " + (isActive ? "active" : "")
              }
            >
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </>
  );
};

export default Sidebar;