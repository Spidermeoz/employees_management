import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

// Mock employees for selection
const mockEmployees = [
  { id: 1, name: "Nguyễn Văn A" },
  { id: 2, name: "Trần Thị B" },
  { id: 3, name: "Phạm Văn C" },
];

const ContractCreate: React.FC = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    employee_id: "",
    type: "",
    start_date: "",
    end_date: "",
    note: "",
    file: null as File | null,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setForm({ ...form, file: e.target.files[0] });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    console.log("New Contract:", form);
    alert("Hợp đồng đã được tạo (mock). Chưa kết nối API.");

    navigate("/contracts");
  };

  return (
    <div className="container-fluid">
      <h3 className="fw-bold mb-4">Thêm hợp đồng lao động</h3>

      <form onSubmit={handleSubmit} className="card p-4 shadow-sm border-0">

        {/* Employee select */}
        <div className="mb-3">
          <label className="form-label fw-bold">Nhân viên</label>
          <select
            className="form-select"
            name="employee_id"
            value={form.employee_id}
            onChange={handleChange}
            required
          >
            <option value="">-- Chọn nhân viên --</option>
            {mockEmployees.map((e) => (
              <option key={e.id} value={e.id}>
                {e.name}
              </option>
            ))}
          </select>
        </div>

        {/* Contract Type */}
        <div className="mb-3">
          <label className="form-label fw-bold">Loại hợp đồng</label>
          <input
            type="text"
            className="form-control"
            name="type"
            value={form.type}
            onChange={handleChange}
            placeholder="Ví dụ: HĐ Lao động 1 năm"
            required
          />
        </div>

        {/* Dates */}
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label fw-bold">Ngày bắt đầu</label>
            <input
              type="date"
              className="form-control"
              name="start_date"
              value={form.start_date}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-md-6">
            <label className="form-label fw-bold">Ngày kết thúc</label>
            <input
              type="date"
              className="form-control"
              name="end_date"
              value={form.end_date}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* File Upload */}
        <div className="mt-3">
          <label className="form-label fw-bold">File hợp đồng</label>
          <input type="file" className="form-control" onChange={handleFileChange} />
          {form.file && (
            <p className="mt-2 text-muted">Đã chọn: {form.file.name}</p>
          )}
        </div>

        {/* Note */}
        <div className="mt-3">
          <label className="form-label fw-bold">Ghi chú</label>
          <textarea
            className="form-control"
            rows={3}
            name="note"
            value={form.note}
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
            onClick={() => navigate("/contracts")}
          >
            Hủy
          </button>
        </div>

      </form>
    </div>
  );
};

export default ContractCreate;
