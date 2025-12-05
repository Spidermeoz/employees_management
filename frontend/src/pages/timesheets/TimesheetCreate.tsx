import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

// Mock employees
const mockEmployees = [
  { id: 1, name: "Nguyễn Văn A" },
  { id: 2, name: "Trần Thị B" },
  { id: 3, name: "Phạm Văn C" },
];

const TimesheetCreate: React.FC = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    employee_id: "",
    date: "",
    check_in: "",
    check_out: "",
    hours: 0,
  });

  // Tính số giờ giữa check-in và check-out
  const calculateHours = (start: string, end: string) => {
    if (!start || !end) return 0;

    const s = new Date(`2020-01-01T${start}`);
    const e = new Date(`2020-01-01T${end}`);

    const diffMs = e.getTime() - s.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);

    return diffHours > 0 ? Number(diffHours.toFixed(2)) : 0;
  };

  useEffect(() => {
    const hours = calculateHours(form.check_in, form.check_out);
    setForm((prev) => ({ ...prev, hours }));
  }, [form.check_in, form.check_out]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    console.log("New Timesheet:", form);
    alert("Chấm công đã được tạo (mock). API chưa kết nối.");
    navigate("/timesheets");
  };

  return (
    <div className="container-fluid">
      <h3 className="fw-bold mb-4">Thêm chấm công</h3>

      <form onSubmit={handleSubmit} className="card p-4 shadow-sm border-0">

        {/* EMPLOYEE SELECT */}
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

        {/* DATE */}
        <div className="mb-3">
          <label className="form-label fw-bold">Ngày</label>
          <input
            type="date"
            className="form-control"
            name="date"
            value={form.date}
            onChange={handleChange}
            required
          />
        </div>

        {/* TIME INPUTS */}
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label fw-bold">Giờ check-in</label>
            <input
              type="time"
              className="form-control"
              name="check_in"
              value={form.check_in}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-md-6">
            <label className="form-label fw-bold">Giờ check-out</label>
            <input
              type="time"
              className="form-control"
              name="check_out"
              value={form.check_out}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* HOURS */}
        <div className="mt-3">
          <label className="form-label fw-bold">Số giờ làm</label>
          <input
            type="number"
            className="form-control"
            value={form.hours}
            readOnly
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
            onClick={() => navigate("/timesheets")}
          >
            Hủy
          </button>
        </div>

      </form>
    </div>
  );
};

export default TimesheetCreate;
