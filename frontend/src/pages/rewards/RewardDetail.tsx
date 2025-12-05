import React from "react";
import { useNavigate, } from "react-router-dom";

const mockReward = {
  id: 1,
  employee_name: "Nguyễn Văn A",
  type: "reward",
  title: "Thưởng Tết",
  amount: 2000000,
  date: "2024-12-28",
  note: "Nhân viên xuất sắc",
};

const RewardDetail: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between mb-3">
        <h3 className="fw-bold">Chi tiết thưởng/kỷ luật</h3>

        <button className="btn btn-secondary" onClick={() => navigate("/rewards")}>
          ← Quay lại
        </button>
      </div>

      <div className="card p-4 shadow-sm border-0">
        <p><strong>Nhân viên:</strong> {mockReward.employee_name}</p>

        <p>
          <strong>Loại:</strong>{" "}
          {mockReward.type === "reward" ? (
            <span className="badge bg-success">Thưởng</span>
          ) : (
            <span className="badge bg-danger">Kỷ luật</span>
          )}
        </p>

        <p><strong>Tiêu đề:</strong> {mockReward.title}</p>
        <p><strong>Số tiền:</strong> {mockReward.amount.toLocaleString("vi-VN")}₫</p>
        <p><strong>Ngày:</strong> {mockReward.date}</p>
        <p><strong>Ghi chú:</strong> {mockReward.note || "—"}</p>
      </div>
    </div>
  );
};

export default RewardDetail;
