import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

// Mock salary grades
const mockGrades = [
  { id: 1, grade_name: "Bậc 1", base_salary: 6000000, coefficient: 1.0 },
  { id: 2, grade_name: "Bậc 2", base_salary: 7000000, coefficient: 1.2 },
  { id: 3, grade_name: "Bậc 3", base_salary: 9000000, coefficient: 1.5 },
];

// Mock employees with salary_grade_id
const mockEmployees = [
  { id: 1, code: "NV001", name: "Nguyễn Văn A", department: "Phòng Kế toán", position: "Kế toán viên", status: "active", salary_grade_id: 1 },
  { id: 2, code: "NV002", name: "Trần Thị B", department: "Phòng Nhân sự", position: "HR Executive", status: "active", salary_grade_id: 2 },
  { id: 3, code: "NV003", name: "Phạm Văn C", department: "Phòng IT", position: "Developer", status: "active", salary_grade_id: 2 },
  { id: 4, code: "NV004", name: "Lê Thị D", department: "Phòng IT", position: "Tester", status: "inactive", salary_grade_id: 3 },
];

const SalaryGradeDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [grade, setGrade] = useState<any>(null);
  const [employees, setEmployees] = useState<any[]>([]);

  useEffect(() => {
    // Load grade info
    const g = mockGrades.find((gr) => gr.id === Number(id));
    setGrade(g || null);

    // Load employees having this salary grade
    const list = mockEmployees.filter((e) => e.salary_grade_id === Number(id));
    setEmployees(list);
  }, [id]);

  if (!grade) return <p>Đang tải dữ liệu...</p>;

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
              <th>Phòng ban</th>
              <th>Chức vụ</th>
              <th>Trạng thái</th>
              <th style={{ width: "150px" }}>Hành động</th>
            </tr>
          </thead>

          <tbody>
            {employees.length > 0 ? (
              employees.map((emp) => (
                <tr key={emp.id}>
                  <td>{emp.code}</td>
                  <td>{emp.name}</td>
                  <td>{emp.department}</td>
                  <td>{emp.position}</td>
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
