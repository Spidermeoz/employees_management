import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const mockRewards = [
  {
    id: 1,
    employee_name: "Nguyễn Văn A",
    type: "reward",
    title: "Thưởng Tết",
    amount: 2000000,
    date: "2024-12-28",
  },
  {
    id: 2,
    employee_name: "Trần Thị B",
    type: "discipline",
    title: "Đi trễ",
    amount: -200000,
    date: "2024-11-20",
  },
];

const RewardsList: React.FC = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const filtered = mockRewards.filter((r) =>
    r.employee_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container-fluid">
      <h3 className="fw-bold mb-4">Thưởng / Kỷ luật</h3>

      {/* SEARCH */}
      <div className="d-flex justify-content-between mb-3">
        <input
          type="text"
          className="form-control w-25"
          placeholder="Tìm theo tên nhân viên..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <button
          className="btn btn-primary"
          onClick={() => navigate("/rewards/create")}
        >
          ➕ Thêm mục thưởng/phạt
        </button>
      </div>

      <div className="card shadow-sm border-0">
        <table className="table table-striped mb-0">
          <thead className="table-light">
            <tr>
              <th>Nhân viên</th>
              <th>Loại</th>
              <th>Tiêu đề</th>
              <th>Số tiền</th>
              <th>Ngày</th>
              <th style={{ width: "160px" }}>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((item) => (
              <tr key={item.id}>
                <td>{item.employee_name}</td>

                <td>
                  {item.type === "reward" ? (
                    <span className="badge bg-success">Thưởng</span>
                  ) : (
                    <span className="badge bg-danger">Kỷ luật</span>
                  )}
                </td>

                <td>{item.title}</td>
                <td>{item.amount.toLocaleString("vi-VN")}₫</td>
                <td>{item.date}</td>

                <td>
                  <button
                    className="btn btn-sm btn-info me-2"
                    onClick={() => navigate(`/rewards/${item.id}`)}
                  >
                    👁 Xem
                  </button>

                  <button
                    className="btn btn-sm btn-warning me-2"
                    onClick={() => navigate(`/rewards/${item.id}/edit`)}
                  >
                    ✏ Sửa
                  </button>

                  <button className="btn btn-sm btn-danger">🗑 Xóa</button>
                </td>
              </tr>
            ))}

            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-3 text-muted">
                  Không có dữ liệu.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RewardsList;
