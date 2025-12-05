import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

// Mock employee list for selecting "Trưởng phòng"
const mockEmployees = [
  { id: 1, name: "Nguyễn Văn A" },
  { id: 2, name: "Trần Thị B" },
  { id: 3, name: "Phạm Văn C" },
];

const DepartmentCreate: React.FC = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    description: "",
    phone: "",
    manager_id: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    console.log("New Department:", form);
    alert("Phòng ban đã được tạo (mock). Chưa kết nối API.");
    navigate("/departments");
  };

  return (
    <div className="container-fluid">
      <h3 className="fw-bold mb-4">Thêm phòng ban</h3>

      <form onSubmit={handleSubmit} className="card p-4 shadow-sm border-0">

        {/* Tên phòng ban */}
        <div className="mb-3">
          <label className="form-label fw-bold">Tên phòng ban</label>
          <input
            type="text"
            className="form-control"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>

        {/* Mô tả */}
        <div className="mb-3">
          <label className="form-label fw-bold">Mô tả</label>
          <textarea
            className="form-control"
            name="description"
            rows={3}
            value={form.description}
            onChange={handleChange}
          ></textarea>
        </div>

        {/* Số điện thoại */}
        <div className="mb-3">
          <label className="form-label fw-bold">Số điện thoại</label>
          <input
            type="text"
            className="form-control"
            name="phone"
            value={form.phone}
            onChange={handleChange}
          />
        </div>

        {/* Trưởng phòng */}
        <div className="mb-3">
          <label className="form-label fw-bold">Trưởng phòng</label>
          <select
            name="manager_id"
            className="form-select"
            value={form.manager_id}
            onChange={handleChange}
          >
            <option value="">-- Chọn trưởng phòng --</option>
            {mockEmployees.map((emp) => (
              <option key={emp.id} value={emp.id}>
                {emp.name}
              </option>
            ))}
          </select>
        </div>

        {/* BUTTONS */}
        <div className="mt-4 d-flex gap-3">
          <button type="submit" className="btn btn-primary px-4">
            Lưu
          </button>

          <button
            type="button"
            className="btn btn-secondary px-4"
            onClick={() => navigate("/departments")}
          >
            Hủy
          </button>
        </div>
      </form>
    </div>
  );
};

export default DepartmentCreate;
