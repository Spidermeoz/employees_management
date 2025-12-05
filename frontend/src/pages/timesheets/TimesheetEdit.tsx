import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

// Mock employees
const mockEmployees = [
  { id: 1, name: "Nguyễn Văn A" },
  { id: 2, name: "Trần Thị B" },
  { id: 3, name: "Phạm Văn C" },
];

// Mock timesheets
const mockTimesheets = [
  {
    id: 1,
    employee_id: 1,
    date: "2025-02-01",
    check_in: "08:00",
    check_out: "17:00",
    hours: 8,
  },
  {
    id: 2,
    employee_id: 1,
    date: "2025-02-02",
    check_in: "08:30",
    check_out: "17:15",
    hours: 7.5,
  },
  {
    id: 3,
    employee_id: 2,
    date: "2025-02-01",
    check_in: "09:00",
    check_out: "18:00",
    hours: 8,
  },
];

const TimesheetEdit: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    employee_id: "",
    date: "",
    check_in: "",
    check_out: "",
    hours: 0,
  });

  // Tính số giờ làm
  const calculateHours = (start: string, end: string) => {
    if (!start || !end) return 0;

    const s = new Date(`2020-01-01T${start}`);
    const e = new Date(`2020-01-01T${end}`);

    const diffMs = e.getTime() - s.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);

    return diffHours > 0 ? Number(diffHours.toFixed(2)) : 0;
  };

  // Load Timesheet theo ID
  useEffect(() => {
    const ts = mockTimesheets.find((t) => t.id === Number(id));

    if (ts) {
      setForm({
        employee_id: String(ts.employee_id),
        date: ts.date,
        check_in: ts.check_in,
        check_out: ts.check_out,
        hours: ts.hours,
      });
    }
    setLoading(false);
  }, [id]);

  // Tự động tính lại số giờ khi thay đổi giờ
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

    console.log("Updated timesheet:", form);
    alert("Chấm công đã được cập nhật (mock). API chưa kết nối.");
    navigate("/timesheets");
  };

  if (loading) return <p>Đang tải dữ liệu...</p>;

  return (
    <div className="container-fluid">
      <h3 className="fw-bold mb-4">Chỉnh sửa chấm công</h3>

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
            {mockEmployees.map((e) => (
              <option key={e.id} value={e.id}>
                {e.name}
              </option>
            ))}
          </select>
        </div>

        {/* Date */}
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

        {/* Check-in / Check-out */}
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

        {/* Hours */}
        <div className="mt-3">
          <label className="form-label fw-bold">Số giờ làm</label>
          <input
            type="number"
            className="form-control"
            value={form.hours}
            readOnly
          />
        </div>

        {/* Buttons */}
        <div className="mt-4 d-flex gap-3">
          <button type="submit" className="btn btn-primary px-4">
            Cập nhật
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

export default TimesheetEdit;
