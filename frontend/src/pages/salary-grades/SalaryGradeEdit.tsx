import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

// Mock salary grades
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

const SalaryGradeEdit: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    grade_name: "",
    base_salary: "",
    coefficient: "",
  });

  // Load grade by ID
  useEffect(() => {
    const grade = mockGrades.find((g) => g.id === Number(id));

    if (grade) {
      setForm({
        grade_name: grade.grade_name,
        base_salary: String(grade.base_salary),
        coefficient: String(grade.coefficient),
      });
    }

    setLoading(false);
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    console.log("Updated Salary Grade:", form);
    alert("Cập nhật bậc lương (mock). API chưa kết nối.");
    navigate("/salary-grades");
  };

  if (loading) return <p>Đang tải dữ liệu...</p>;

  return (
    <div className="container-fluid">
      <h3 className="fw-bold mb-4">Chỉnh sửa bậc lương</h3>

      <form onSubmit={handleSubmit} className="card p-4 shadow-sm border-0">

        {/* GRADE NAME */}
        <div className="mb-3">
          <label className="form-label fw-bold">Tên bậc lương</label>
          <input
            type="text"
            className="form-control"
            name="grade_name"
            value={form.grade_name}
            onChange={handleChange}
            required
          />
        </div>

        {/* BASE SALARY */}
        <div className="mb-3">
          <label className="form-label fw-bold">Lương cơ bản (VNĐ)</label>
          <input
            type="number"
            className="form-control"
            name="base_salary"
            value={form.base_salary}
            onChange={handleChange}
            min={0}
            required
          />
        </div>

        {/* COEFFICIENT */}
        <div className="mb-3">
          <label className="form-label fw-bold">Hệ số</label>
          <input
            type="number"
            step="0.01"
            className="form-control"
            name="coefficient"
            value={form.coefficient}
            onChange={handleChange}
            min={0}
            required
          />
        </div>

        {/* BUTTONS */}
        <div className="mt-4 d-flex gap-3">
          <button type="submit" className="btn btn-primary px-4">
            Cập nhật
          </button>

          <button
            type="button"
            className="btn btn-secondary px-4"
            onClick={() => navigate("/salary-grades")}
          >
            Hủy
          </button>
        </div>

      </form>
    </div>
  );
};

export default SalaryGradeEdit;
