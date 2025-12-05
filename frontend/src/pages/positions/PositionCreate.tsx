import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const PositionCreate: React.FC = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    level: 1,
    description: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    console.log("New Position:", form);
    alert("Chức vụ đã được tạo (mock). API chưa kết nối.");
    navigate("/positions");
  };

  return (
    <div className="container-fluid">
      <h3 className="fw-bold mb-4">Thêm chức vụ</h3>

      <form onSubmit={handleSubmit} className="card p-4 shadow-sm border-0">
        
        {/* NAME */}
        <div className="mb-3">
          <label className="form-label fw-bold">Tên chức vụ</label>
          <input
            type="text"
            className="form-control"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>

        {/* LEVEL */}
        <div className="mb-3">
          <label className="form-label fw-bold">Level</label>
          <input
            type="number"
            min={1}
            className="form-control"
            name="level"
            value={form.level}
            onChange={handleChange}
            required
          />
        </div>

        {/* DESCRIPTION */}
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

        {/* BUTTONS */}
        <div className="mt-4 d-flex gap-3">
          <button type="submit" className="btn btn-primary px-4">
            Lưu
          </button>

          <button
            type="button"
            className="btn btn-secondary px-4"
            onClick={() => navigate("/positions")}
          >
            Hủy
          </button>
        </div>

      </form>
    </div>
  );
};

export default PositionCreate;
