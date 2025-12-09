import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { apiGet } from "../../api/client";

// Kiểu dữ liệu đúng theo SalaryGradeResponse schema
type SalaryGrade = {
  id: number;
  grade_name: string;
  base_salary: number; // hoặc Decimal -> backend trả về string, FE convert
  coefficient: number;
};

const SalaryGradesList: React.FC = () => {
  const navigate = useNavigate();

  const [grades, setGrades] = useState<SalaryGrade[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 🔥 Load dữ liệu thật từ backend
  useEffect(() => {
    const fetchGrades = async () => {
      try {
        const data = await apiGet<SalaryGrade[]>("/salary-grades");

        // Nếu backend trả DECIMAL dưới dạng string (thường gặp)
        const normalized = data.map((g: any) => ({
          ...g,
          base_salary: Number(g.base_salary),
          coefficient: Number(g.coefficient),
        }));

        setGrades(normalized);
      } catch (err) {
        console.error("Error loading salary grades:", err);
        setError("Không thể tải danh sách bậc lương");
      } finally {
        setLoading(false);
      }
    };

    fetchGrades();
  }, []);

  // Bộ lọc search
  const filtered = grades.filter((g) =>
    g.grade_name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <p className="m-3">Đang tải dữ liệu...</p>;

  if (error) return <div className="alert alert-danger m-3">{error}</div>;

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
                  {/* DETAIL */}
                  <button
                    className="btn btn-sm btn-info me-2"
                    onClick={() => navigate(`/salary-grades/${g.id}`)}
                  >
                    👁 Xem
                  </button>

                  {/* EDIT */}
                  <button
                    className="btn btn-sm btn-warning me-2"
                    onClick={() => navigate(`/salary-grades/${g.id}/edit`)}
                  >
                    ✏ Sửa
                  </button>

                  {/* DELETE (chưa làm backend phần này) */}
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
