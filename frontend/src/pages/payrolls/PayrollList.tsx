import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const mPayroll = [
  {
    id: 1,
    employee_name: "Nguyễn Văn A",
    month: 1,
    year: 2025,
    base_salary: 8000000,
    allowance: 1500000,
    bonus: 2000000,
    penalty: 200000,
    total: 11300000,
  },
];

const PayrollList: React.FC = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const filtered = mPayroll.filter((p) =>
    p.employee_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container-fluid">
      <h3 className="fw-bold mb-4">Bảng lương</h3>

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
          onClick={() => navigate("/payrolls/create")}
        >
          ➕ Tạo bảng lương
        </button>
      </div>

      <div className="card shadow-sm border-0">
        <table className="table table-striped mb-0">
          <thead className="table-light">
            <tr>
              <th>Nhân viên</th>
              <th>Tháng</th>
              <th>Lương cơ bản</th>
              <th>Phụ cấp</th>
              <th>Thưởng</th>
              <th>Phạt</th>
              <th>Tổng</th>
              <th style={{ width: "160px" }}>Hành động</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((p) => (
              <tr key={p.id}>
                <td>{p.employee_name}</td>
                <td>{p.month}/{p.year}</td>
                <td>{p.base_salary.toLocaleString("vi-VN")}₫</td>
                <td>{p.allowance.toLocaleString("vi-VN")}₫</td>
                <td>{p.bonus.toLocaleString("vi-VN")}₫</td>
                <td>{p.penalty.toLocaleString("vi-VN")}₫</td>
                <td className="fw-bold text-primary">
                  {p.total.toLocaleString("vi-VN")}₫
                </td>

                <td>
                  <button
                    className="btn btn-sm btn-info me-2"
                    onClick={() => navigate(`/payrolls/${p.id}`)}
                  >
                    👁 Xem
                  </button>

                  <button
                    className="btn btn-sm btn-warning me-2"
                    onClick={() => navigate(`/payrolls/${p.id}/edit`)}
                  >
                    ✏ Sửa
                  </button>

                  <button className="btn btn-sm btn-danger">🗑 Xóa</button>
                </td>
              </tr>
            ))}

            {filtered.length === 0 && (
              <tr>
                <td colSpan={8} className="text-center py-3 text-muted">
                  Không tìm thấy dữ liệu.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PayrollList;
