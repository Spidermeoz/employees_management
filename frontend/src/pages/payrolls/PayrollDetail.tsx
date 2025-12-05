import React from "react";
import { useNavigate, } from "react-router-dom";

const mockPayroll = {
  id: 1,
  employee_name: "Nguyễn Văn A",
  month: 1,
  year: 2025,
  base_salary: 8000000,
  allowance: 1500000,
  bonus: 2000000,
  penalty: 200000,
  total: 11300000,
};

const PayrollDetail: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between mb-3">
        <h3 className="fw-bold">Chi tiết bảng lương</h3>

        <button className="btn btn-secondary" onClick={() => navigate("/payrolls")}>
          ← Quay lại
        </button>
      </div>

      <div className="card p-4 shadow-sm border-0">
        <p><strong>Nhân viên:</strong> {mockPayroll.employee_name}</p>
        <p><strong>Tháng:</strong> {mockPayroll.month}/{mockPayroll.year}</p>
        <p><strong>Lương cơ bản:</strong> {mockPayroll.base_salary.toLocaleString("vi-VN")}₫</p>
        <p><strong>Phụ cấp:</strong> {mockPayroll.allowance.toLocaleString("vi-VN")}₫</p>
        <p><strong>Thưởng:</strong> {mockPayroll.bonus.toLocaleString("vi-VN")}₫</p>
        <p><strong>Phạt:</strong> {mockPayroll.penalty.toLocaleString("vi-VN")}₫</p>

        <h4 className="fw-bold mt-3 text-primary">
          Tổng: {mockPayroll.total.toLocaleString("vi-VN")}₫
        </h4>
      </div>
    </div>
  );
};

export default PayrollDetail;
