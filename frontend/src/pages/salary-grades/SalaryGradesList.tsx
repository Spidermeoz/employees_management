import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

// MOCK DATA
const mockGrades = [
  {
    id: 1,
    grade_name: "Bậc 1",
    base_salary: 6000000,
    coefficient: 1.0,
  },
  {
    id: 2,
    grade_name: "Bậc 2",
    base_salary: 7000000,
    coefficient: 1.2,
  },
  {
    id: 3,
    grade_name: "Bậc 3",
    base_salary: 9000000,
    coefficient: 1.5,
  },
];

const SalaryGradesList: React.FC = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const filtered = mockGrades.filter((g) =>
    g.grade_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container-fluid">
      <h3 className="fw-bold mb-4">Danh sách bậc lương</h3>

      {/* SEARCH + ADD BUTTON */}
      <div className="d-flex justify-content-between mb-3">
        <input
          type="text"
          className="form-control w-25"
          placeholder="Tìm theo tên bậc lương..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <button
          className="btn btn-primary"
          onClick={() => navigate("/salary-grades/create")}
        >
          ➕ Thêm bậc lương
        </button>
      </div>

      {/* TABLE */}
      <div className="card shadow-sm border-0">
        <table className="table table-striped mb-0">
          <thead className="table-light">
            <tr>
              <th>Tên bậc</th>
              <th>Lương cơ bản</th>
              <th>Hệ số</th>
              <th style={{ width: "160px" }}>Hành động</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((g) => (
              <tr key={g.id}>
                <td>{g.grade_name}</td>
                <td>{g.base_salary.toLocaleString("vi-VN")} ₫</td>
                <td>
                  <span className="badge bg-secondary">{g.coefficient}</span>
                </td>

                <td>
                  <button
                    className="btn btn-sm btn-info me-2"
                    onClick={() => navigate(`/salary-grades/${g.id}`)}
                  >
                    👁 Xem
                  </button>

                  <button
                    className="btn btn-sm btn-warning me-2"
                    onClick={() => navigate(`/salary-grades/${g.id}/edit`)}
                  >
                    ✏ Sửa
                  </button>

                  <button className="btn btn-sm btn-danger">🗑 Xóa</button>
                </td>
              </tr>
            ))}

            {filtered.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center py-3 text-muted">
                  Không tìm thấy bậc lương nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SalaryGradesList;
