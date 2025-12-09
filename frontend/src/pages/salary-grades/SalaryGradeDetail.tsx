import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { apiGet } from "../../api/client";

type SalaryGrade = {
  id: number;
  grade_name: string;
  base_salary: number;
  coefficient: number;
};

type Employee = {
  id: number;
  code: string;
  full_name: string;
  department_id?: number | null;
  position_id?: number | null;
  status: string;
};

const SalaryGradeDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [grade, setGrade] = useState<SalaryGrade | null>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 🔥 Load dữ liệu thật từ backend
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        // 1️⃣ Lấy thông tin bậc lương
        const gradeData = await apiGet<SalaryGrade>(`/salary-grades/${id}`);

        // Backend trả DECIMAL dưới dạng string?
        const normalizedGrade = {
          ...gradeData,
          base_salary: Number(gradeData.base_salary),
          coefficient: Number(gradeData.coefficient),
        };
        setGrade(normalizedGrade);

        // 2️⃣ Lấy danh sách employee theo salary_grade_id
        const empData = await apiGet<Employee[]>(
          `/employees?salary_grade_id=${id}`
        );
        setEmployees(empData);
      } catch (err) {
        console.error(err);
        setError("Không thể tải dữ liệu.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  if (loading) return <p className="m-3">Đang tải dữ liệu...</p>;

  if (error) return <div className="alert alert-danger m-3">{error}</div>;

  if (!grade) return <p className="m-3">Không tìm thấy bậc lương.</p>;

  return (
    <div className="container-fluid">
      <h3 className="fw-bold mb-4">Chi tiết bậc lương</h3>

      {/* SALARY GRADE CARD */}
      <div className="card p-4 shadow-sm border-0 mb-4">
        <h4 className="fw-bold">{grade.grade_name}</h4>

        <p>
          <strong>Lương cơ bản:</strong>{" "}
          {grade.base_salary.toLocaleString("vi-VN")} ₫
        </p>

        <p>
          <strong>Hệ số:</strong>{" "}
          <span className="badge bg-secondary">{grade.coefficient}</span>
        </p>

        <div className="mt-3 d-flex gap-3">
          <button
            className="btn btn-warning"
            onClick={() => navigate(`/salary-grades/${grade.id}/edit`)}
          >
            ✏ Sửa bậc lương
          </button>

          <button
            className="btn btn-secondary"
            onClick={() => navigate("/salary-grades")}
          >
            ↩ Quay lại
          </button>
        </div>
      </div>

      {/* EMPLOYEES TABLE */}
      <div className="card shadow-sm border-0 p-4">
        <h5 className="fw-bold mb-3">Nhân viên áp dụng bậc này</h5>

        <table className="table table-striped">
          <thead className="table-light">
            <tr>
              <th>Mã NV</th>
              <th>Họ tên</th>
              <th>Phòng ban (ID)</th>
              <th>Chức vụ (ID)</th>
              <th>Trạng thái</th>
              <th style={{ width: "150px" }}>Hành động</th>
            </tr>
          </thead>

          <tbody>
            {employees.length > 0 ? (
              employees.map((emp) => (
                <tr key={emp.id}>
                  <td>{emp.code}</td>
                  <td>{emp.full_name}</td>
                  <td>{emp.department_id || "—"}</td>
                  <td>{emp.position_id || "—"}</td>
                  <td>
                    <span
                      className={
                        emp.status === "active"
                          ? "badge bg-success"
                          : "badge bg-secondary"
                      }
                    >
                      {emp.status === "active" ? "Đang làm" : "Nghỉ việc"}
                    </span>
                  </td>

                  <td>
                    <button
                      className="btn btn-sm btn-info me-2"
                      onClick={() => navigate(`/employees/${emp.id}`)}
                    >
                      👁 Xem
                    </button>

                    <button
                      className="btn btn-sm btn-warning"
                      onClick={() => navigate(`/employees/${emp.id}/edit`)}
                    >
                      ✏ Sửa
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center py-3 text-muted">
                  Không có nhân viên áp dụng bậc lương này.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SalaryGradeDetail;
