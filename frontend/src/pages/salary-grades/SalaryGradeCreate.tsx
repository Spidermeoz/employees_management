import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const SalaryGradeCreate: React.FC = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    grade_name: "",
    base_salary: "",
    coefficient: "1.00",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    console.log("New Salary Grade:", form);
    alert("Bậc lương đã được tạo (mock). API chưa kết nối.");
    navigate("/salary-grades");
  };

  return (
    <div className="container-fluid">
      <h3 className="fw-bold mb-4">Thêm bậc lương</h3>

      <form onSubmit={handleSubmit} className="card p-4 shadow-sm border-0">

        {/* Tên bậc */}
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

        {/* Lương cơ bản */}
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

        {/* Hệ số */}
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
            Lưu
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

export default SalaryGradeCreate;
