import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { apiGet, apiDelete } from "../../api/client";
import {
  FaEye,
  FaEdit,
  FaTrash,
  FaPlus,
  FaSearch,
  FaInbox,
  FaSortUp, // Thêm icon sắp xếp
} from "react-icons/fa";

// Kiểu dữ liệu đúng theo SalaryGradeResponse schema
type SalaryGrade = {
  id: number;
  grade_name: string;
  base_salary: number;
  coefficient: number;
};

const SalaryGradesList: React.FC = () => {
  const navigate = useNavigate();

  const [grades, setGrades] = useState<SalaryGrade[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 🔥 Tách logic fetch dữ liệu ra một hàm riêng để có thể gọi lại
  const fetchGrades = async () => {
    try {
      setLoading(true);
      const data = await apiGet<SalaryGrade[]>("/salary-grades");

      // Nếu backend trả DECIMAL dưới dạng string (thường gặp)
      const normalized = data.map((g: any) => ({
        ...g,
        base_salary: Number(g.base_salary),
        coefficient: Number(g.coefficient),
      }));

      // 🚀 Sắp xếp mặc định theo hệ số từ thấp đến cao
      normalized.sort((a, b) => a.coefficient - b.coefficient);

      setGrades(normalized);
    } catch (err) {
      console.error("Error loading salary grades:", err);
      setError("Không thể tải danh sách bậc lương");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGrades();
  }, []);

  // Bộ lọc search
  const filtered = grades.filter((g) =>
    g.grade_name.toLowerCase().includes(search.toLowerCase())
  );

  // 🔥 Hàm xử lý xóa bậc lương
  const handleDelete = async (id: number, name: string) => {
    const confirmDelete = window.confirm(
      `Bạn có chắc chắn muốn xóa bậc lương "${name}"?`
    );
    if (!confirmDelete) {
      return;
    }

    try {
      await apiDelete(`/salary-grades/${id}`);
      alert("Xóa bậc lương thành công!");
      // Tải lại danh sách bậc lương sau khi xóa thành công
      fetchGrades();
    } catch (err) {
      console.error(err);
      alert("Lỗi! Không thể xóa bậc lương.");
    }
  };

  if (loading) return <p className="m-3 text-center">Đang tải dữ liệu...</p>;
  if (error) return <div className="alert alert-danger m-3">{error}</div>;

  return (
    <div className="container-fluid p-4" style={{ backgroundColor: "#f8f9fa" }}>
      <div className="card shadow-sm border-0">
        <div className="card-header bg-white py-3">
          <h3 className="fw-bold mb-0">Danh sách bậc lương</h3>
        </div>
        <div className="card-body">
          {/* SEARCH + ADD BUTTON */}
          <div className="row g-3 mb-4 align-items-center">
            <div className="col-md-6">
              <div className="input-group">
                <span className="input-group-text bg-white">
                  <FaSearch />
                </span>
                <input
                  type="text"
                  className="form-control border-start-0"
                  placeholder="Tìm theo tên bậc lương..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-6 text-md-end">
              <button
                className="btn btn-primary"
                onClick={() => navigate("/salary-grades/create")}
              >
                <FaPlus className="me-1" /> Thêm bậc lương
              </button>
            </div>
          </div>

          {/* TABLE */}
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th>Tên bậc</th>
                  <th>Lương cơ bản</th>
                  <th>
                    Hệ số{" "}
                    <FaSortUp className="ms-1" style={{ fontSize: "0.8em" }} />
                  </th>
                  <th style={{ width: "180px" }}>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((g) => (
                  <tr key={g.id}>
                    <td>{g.grade_name}</td>
                    <td>{g.base_salary.toLocaleString("vi-VN")} ₫</td>
                    <td>
                      <span className="badge bg-secondary">
                        {g.coefficient}
                      </span>
                    </td>

                    <td>
                      {/* DETAIL */}
                      <button
                        className="btn btn-sm btn-info text-white me-1"
                        onClick={() => navigate(`/salary-grades/${g.id}`)}
                        title="Xem chi tiết"
                      >
                        <FaEye />
                      </button>

                      {/* EDIT */}
                      <button
                        className="btn btn-sm btn-warning me-1"
                        onClick={() => navigate(`/salary-grades/${g.id}/edit`)}
                        title="Chỉnh sửa"
                      >
                        <FaEdit />
                      </button>

                      {/* NÚT XÓA ĐÃ ĐƯỢC CẬP NHẬT */}
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(g.id, g.grade_name)}
                        title="Xóa bậc lương"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}

                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={4} className="text-center py-4 text-muted">
                      <FaInbox className="me-2" />
                      Không tìm thấy bậc lương nào.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalaryGradesList;
